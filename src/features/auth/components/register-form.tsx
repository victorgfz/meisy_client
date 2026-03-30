import type { SubmitEventHandler } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { RegisterFormValues } from '../hooks/use-register';
import { REGISTER_CONSTANTS } from '../constants/register.constants';
import { ServerErrorBox } from './server-error-box';

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
  showPassword: boolean;
  onTogglePasswordVisibility: () => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  serverErrors: string[] | null;
}

export function RegisterForm({
  form,
  isLoading,
  showPassword,
  onTogglePasswordVisibility,
  onSubmit,
  serverErrors,
}: RegisterFormProps) {
  const {
    nameLabel,
    namePlaceholder,
    emailLabel,
    emailPlaceholder,
    passwordLabel,
    passwordPlaceholder,
    joinCompanyLabel,
    joinCompanyYes,
    joinCompanyNo,
    submitButton,
    companyCodeLabel,
    companyCodePlaceholder,
  } = REGISTER_CONSTANTS.form;

  const { register, watch, formState: { errors } } = form;
  const joinCompany = watch('joinCompany');

  const getInputClass = (hasError: boolean) => {
    return `w-full py-3.5 pr-4 pl-11 rounded-input border ${hasError ? 'border-red-500 focus:ring-red-500/30' : 'border-border focus:border-primary focus:ring-primary/30'} bg-white text-text-primary text-base placeholder:text-text-secondary outline-none focus:ring-1 transition-all duration-200`;
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">

      {serverErrors && <ServerErrorBox message={serverErrors} />}

      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label htmlFor="register-name" className="text-sm font-medium text-text-primary tracking-wide text-xs">
          {nameLabel}
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
          </div>
          <input
            id="register-name"
            type="text"
            {...register('name')}
            placeholder={namePlaceholder}
            autoComplete="name"
            className={getInputClass(!!errors.name)}
          />
        </div>
        {errors.name && (
          <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
        )}
      </fieldset>


      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label htmlFor="register-email" className="text-sm font-medium text-text-primary tracking-wide text-xs">
          {emailLabel}
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
          </div>
          <input
            id="register-email"
            type="text"
            {...register('email')}
            placeholder={emailPlaceholder}
            autoComplete="email"
            className={getInputClass(!!errors.email)}
          />
        </div>
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
        )}
      </fieldset>


      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label htmlFor="register-password" className="text-sm font-medium text-text-primary tracking-wide text-xs">
          {passwordLabel}
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
          </div>
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder={passwordPlaceholder}
            autoComplete="new-password"
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

      <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
        <label className="text-sm font-medium text-text-primary tracking-wide text-xs">
          {joinCompanyLabel}
        </label>
        <div className="flex items-center gap-4 mt-1">
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer hover:opacity-80 transition-opacity">
            <input
              type="radio"
              value="yes"
              {...register('joinCompany')}
              className="w-4 h-4 text-primary focus:ring-primary border-border cursor-pointer accent-primary"
            />
            {joinCompanyYes}
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer hover:opacity-80 transition-opacity">
            <input
              type="radio"
              value="no"
              {...register('joinCompany')}
              className="w-4 h-4 text-primary focus:ring-primary border-border cursor-pointer accent-primary"
            />
            {joinCompanyNo}
          </label>
        </div>
      </fieldset>

      {joinCompany === 'yes' && (
        <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
          <label htmlFor="register-companyCode" className="text-sm font-medium text-text-primary tracking-wide text-xs">
            {companyCodeLabel}
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
            </div>
            <input
              id="register-companyCode"
              type="text"
              {...register('companyCode')}
              placeholder={companyCodePlaceholder}
              autoComplete="companyCode"
              className={getInputClass(!!errors.companyCode)}
            />
          </div>
          {errors.companyCode && (
            <span className="text-red-500 text-xs mt-1">{errors.companyCode.message}</span>
          )}
        </fieldset>
      )}

      {/*
      <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
        <label htmlFor="register-confirm-password" className="text-sm font-medium text-text-primary tracking-wide text-xs">
          {confirmPasswordLabel}
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ShieldCheck className="h-5 w-5 text-text-secondary" strokeWidth={1.5} />
          </div>
          <input
            id="register-confirm-password"
            type={showPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder={confirmPasswordPlaceholder}
            autoComplete="new-password"
            className={getInputClass(!!errors.confirmPassword)}
          />
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>
        )}
      </fieldset> */}


      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full py-4 rounded-button bg-success text-white text-base font-bold tracking-wider border-none cursor-pointer hover:bg-success-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {isLoading ? '...' : submitButton}
      </button>
    </form>
  );
}
