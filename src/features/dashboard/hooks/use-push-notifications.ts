import { useCallback, useEffect, useState } from 'react';
import { notificationsService } from '../services/notifications.service';
import type { PushNotificationStatus } from '../types/notifications.types';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function hasPushSupport() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

function canUsePushInCurrentContext() {
  return window.isSecureContext || window.location.hostname === 'localhost';
}

export function usePushNotifications() {
  const [status, setStatus] = useState<PushNotificationStatus>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const getRegistration = useCallback(async () => {
    return navigator.serviceWorker.register('/sw.js');
  }, []);

  const readCurrentSubscription = useCallback(async () => {
    if (!hasPushSupport() || !canUsePushInCurrentContext()) return null;

    const registration = await getRegistration();
    return registration.pushManager.getSubscription();
  }, [getRegistration]);

  const refreshStatus = useCallback(async () => {
    setMessage(null);

    if (!hasPushSupport() || !canUsePushInCurrentContext()) {
      setStatus('unsupported');
      return;
    }

    if (Notification.permission === 'denied') {
      setStatus('blocked');
      return;
    }

    try {
      setStatus('loading');
      const subscription = await readCurrentSubscription();

      if (!subscription) {
        setStatus('disabled');
        return;
      }

      const preferences = await notificationsService.getPreferences(subscription.endpoint);
      setStatus(preferences.receiveNotifications ? 'enabled' : 'disabled');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, [readCurrentSubscription]);

  const enableNotifications = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (!hasPushSupport() || !canUsePushInCurrentContext()) {
        setStatus('unsupported');
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        setStatus('blocked');
        return false;
      }

      if (permission !== 'granted') {
        setStatus('disabled');
        return false;
      }

      const registration = await getRegistration();
      const existingSubscription = await registration.pushManager.getSubscription();
      const publicKey = await notificationsService.getVapidPublicKey();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const subscriptionData = subscription.toJSON();

      await notificationsService.subscribe({
        endpoint: subscription.endpoint,
        p256DH: subscriptionData.keys?.p256dh ?? '',
        auth: subscriptionData.keys?.auth ?? '',
      });
      await notificationsService.updatePreferences(subscription.endpoint, true);

      setStatus('enabled');
      return true;
    } catch (error) {
      console.error(error);
      setStatus('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getRegistration]);

  const disableNotifications = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const subscription = await readCurrentSubscription();

      if (!subscription) {
        setStatus('disabled');
        return true;
      }

      await notificationsService.updatePreferences(subscription.endpoint, false);
      setStatus('disabled');
      return true;
    } catch (error) {
      console.error(error);
      setStatus('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [readCurrentSubscription]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return {
    status,
    isLoading,
    message,
    setMessage,
    refreshStatus,
    enableNotifications,
    disableNotifications,
  };
}
