import { LoginHeader } from '../components/login-header';
import { LoginForm } from '../components/login-form';
import { useLogin } from '../hooks/use-login';
import { LOGIN_CONSTANTS } from '../constants/login.constants';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const {
    form,
    isLoading,
    onSubmit,
    showPassword,
    handleTogglePasswordVisibility,
    serverErrors
  } = useLogin();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-body">



      <div className="w-full md:w-1/2 bg-gradient-brand pt-12 pb-24 md:py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="hidden md:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center md:pb-16">
          <LoginHeader />
        </div>
      </div>



      <div className="flex-1 md:w-1/2 bg-bg-card rounded-t-[2.5rem] md:rounded-none -mt-8 md:mt-0 z-10 flex flex-col justify-center items-center px-6 py-10 md:py-12 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] md:shadow-none">
        <div className="w-full max-w-md flex flex-col items-center gap-6 md:gap-8">
          <LoginForm
            form={form}
            isLoading={isLoading}
            onSubmit={form.handleSubmit(onSubmit)}
            showPassword={showPassword}
            onTogglePasswordVisibility={handleTogglePasswordVisibility}
            serverErrors={serverErrors}
          />

          <p className="mt-2 md:mt-4 text-sm md:text-base text-text-secondary">
            {LOGIN_CONSTANTS.signup.prompt}{' '}
            <Link
              type="button"
              to={"/auth/register"}
              className="text-primary font-semibold bg-transparent border-none cursor-pointer hover:underline p-0 transition-colors hover:text-primary/80"
            >
              {LOGIN_CONSTANTS.signup.link}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
