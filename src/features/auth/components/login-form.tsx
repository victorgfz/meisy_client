import type { SubmitEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { LoginFormValues } from '../hooks/use-login';
import { LOGIN_CONSTANTS } from '../constants/login.constants';
import { Eye, EyeOff } from 'lucide-react';
import { ServerErrorMessages } from '../../../components/server-error-messages';

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  showPassword: boolean;
  onTogglePasswordVisibility: () => void;
  serverErrors: string[] | null;
}

export function LoginForm({
  form,
  isLoading,
  onSubmit,
  showPassword,
  onTogglePasswordVisibility,
  serverErrors
}: LoginFormProps) {
  const {
    emailLabel,
    emailPlaceholder,
    passwordLabel,
    passwordPlaceholder,
    submitButton,
  } = LOGIN_CONSTANTS.form;

  const { register, formState: { errors } } = form;

  const getInputClass = (hasError: boolean) => {
    return `w-full py-3.5 px-4 rounded-input border ${hasError ? 'border-red-500 focus:ring-red-500/30' : 'border-border focus:border-primary focus:ring-primary/30'} bg-white text-text-primary text-base placeholder:text-text-secondary outline-none focus:ring-1 transition-all duration-200`;
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full">
      {serverErrors && <ServerErrorMessages message={serverErrors} />}

      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label
          htmlFor="login-email"
          className="text-sm font-medium text-text-primary"
        >
          {emailLabel}
        </label>
        <input
          id="login-email"
          type="text"
          {...register('email')}
          placeholder={emailPlaceholder}
          autoComplete="email"
          className={getInputClass(!!errors.email)}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
        )}
      </fieldset>

      {/* Password */}
      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-text-primary"
        >
          {passwordLabel}
        </label>


        <div className="relative w-full">

          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder={passwordPlaceholder}
            autoComplete="current-password"
            className={`${getInputClass(!!errors.password)} pr-12`}
          />
          <button
            type="button"
            onClick={onTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-secondary hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Eye className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>




        {errors.password && (
          <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
        )}
      </fieldset>



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
