export interface PushSubscriptionRequest {
  endpoint: string;
  p256DH: string;
  auth: string;
}

export interface NotificationPreferences {
  receiveNotifications: boolean;
}

export type PushNotificationStatus =
  | 'unsupported'
  | 'blocked'
  | 'disabled'
  | 'enabled'
  | 'loading'
  | 'error';
