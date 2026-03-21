import type { FormEvent } from 'react';
import { LOGIN_CONSTANTS } from '../constants/login.constants';

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
}

export function LoginForm({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  const {
    emailLabel,
    emailPlaceholder,
    passwordLabel,
    passwordPlaceholder,
    forgotPassword,
    submitButton,
  } = LOGIN_CONSTANTS.form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full">
      {/* Email */}
      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label
          htmlFor="login-email"
          className="text-sm font-medium text-text-primary"
        >
          {emailLabel}
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={emailPlaceholder}
          required
          autoComplete="email"
          className="w-full py-3.5 px-4 rounded-input border border-border bg-white text-text-primary text-base placeholder:text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
        />
      </fieldset>

      {/* Password */}
      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-text-primary"
        >
          {passwordLabel}
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={passwordPlaceholder}
          required
          autoComplete="current-password"
          className="w-full py-3.5 px-4 rounded-input border border-border bg-white text-text-primary text-base placeholder:text-text-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
        />
      </fieldset>

      {/* Forgot password link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary font-medium bg-transparent border-none cursor-pointer hover:underline p-0"
        >
          {forgotPassword}
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-button bg-success text-white text-base font-bold tracking-wider border-none cursor-pointer hover:bg-success-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {isLoading ? '...' : submitButton}
      </button>
    </form>
  );
}
