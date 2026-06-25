import { Bell, BellOff, Info, Loader2, Smartphone } from 'lucide-react';
import { NOTIFICATIONS_CONSTANTS } from '../constants/notifications.constants';
import { usePushNotifications } from '../hooks/use-push-notifications';
import { SuccessMessage } from './success-message';

export function PushNotificationSettings() {
  const {
    status,
    isLoading,
    message,
    setMessage,
    enableNotifications,
    disableNotifications,
  } = usePushNotifications();

  const push = NOTIFICATIONS_CONSTANTS.push;
  const isEnabled = status === 'enabled';
  const isBlocked = status === 'blocked';
  const isUnsupported = status === 'unsupported';
  const isStatusLoading = status === 'loading';

  const getStatusText = () => {
    if (isEnabled) return push.enabled;
    if (isBlocked) return push.blocked;
    if (isUnsupported) return push.unsupported;
    return push.disabled;
  };

  const handleToggle = async () => {
    const updated = isEnabled ? await disableNotifications() : await enableNotifications();

    if (!updated) {
      setMessage(push.genericError);
      return;
    }

    setMessage(isEnabled ? push.successDisable : push.successEnable);
  };

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white border border-gray-100 shadow-sm p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {isEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-text-primary">{push.title}</h2>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">{push.description}</p>
        </div>
      </div>

      {message && (
        message === push.genericError ? (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-700 rounded-xl border border-red-200">
            <Info className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">{message}</span>
          </div>
        ) : (
          <SuccessMessage message={message} />
        )
      )}

      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-bg-body">
        <div className="flex items-center gap-3 min-w-0">
          <Smartphone className="w-5 h-5 text-text-secondary shrink-0" />
          <span className="text-sm font-medium text-text-primary">{getStatusText()}</span>
        </div>
        {isStatusLoading && <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isLoading || isStatusLoading || isBlocked || isUnsupported}
          className={`w-full rounded-button py-4 px-5 font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
            isEnabled
              ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
              : 'bg-primary text-white hover:bg-primary-hover shadow-sm'
          }`}
        >
          {isLoading
            ? isEnabled
              ? push.disablingButton
              : push.enablingButton
            : isEnabled
              ? push.disableButton
              : push.enableButton}
        </button>

        <p className="text-xs text-text-secondary leading-relaxed">{push.secureContext}</p>
      </div>
    </section>
  );
}
