import { Facebook, Mail as GoogleIcon } from 'lucide-react';
import { LOGIN_CONSTANTS } from '../constants/login.constants';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: 'google' | 'facebook') => void;
}

export function SocialLoginButtons({ onSocialLogin }: SocialLoginButtonsProps) {
  const { google, facebook } = LOGIN_CONSTANTS.social;

  return (
    <div className="flex gap-4 w-full">
      <button
        type="button"
        onClick={() => onSocialLogin('google')}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-button border border-border bg-white text-text-primary text-sm font-medium hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        <GoogleIcon className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
        {google}
      </button>

      <button
        type="button"
        onClick={() => onSocialLogin('facebook')}
        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-button border border-border bg-white text-text-primary text-sm font-medium hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        <Facebook className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
        {facebook}
      </button>
    </div>
  );
}
