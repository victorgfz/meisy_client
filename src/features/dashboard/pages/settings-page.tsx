import { PushNotificationSettings } from '../components/push-notification-settings';
import { NOTIFICATIONS_CONSTANTS } from '../constants/notifications.constants';

export function SettingsPage() {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto relative pt-6 gap-5">
      <div className="px-1">
        <h1 className="text-2xl font-bold text-text-primary">
          {NOTIFICATIONS_CONSTANTS.page.title}
        </h1>
        <p className="text-text-secondary mt-1">{NOTIFICATIONS_CONSTANTS.page.subtitle}</p>
      </div>

      <PushNotificationSettings />
    </div>
  );
}
