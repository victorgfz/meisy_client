import { ChevronLeft } from 'lucide-react';
import { RegisterHeader } from '../components/register-header';
import { RegisterForm } from '../components/register-form';
import { useRegister } from '../hooks/use-register';
import { REGISTER_CONSTANTS } from '../constants/register.constants';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  const {
    form,
    isLoading,
    showPassword,
    handleTogglePasswordVisibility,
    onSubmit,
    serverErrors,
  } = useRegister();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-body">

      <div className="w-full md:w-1/2 bg-gradient-brand pt-16 pb-24 md:py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">


        <div className="hidden md:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-[100px]"></div>
        </div>


        <div className="absolute top-6 md:top-8 left-6 md:left-8 right-6 md:right-8 flex justify-between items-center z-20">
          <Link
            type="button"
            to={"/auth/login"}
            className="text-white hover:text-white/80 transition-colors border-none bg-transparent cursor-pointer p-0 flex items-center justify-center"
            aria-label="Voltar"
          >
            <ChevronLeft strokeWidth={2.5} size={28} />
          </Link>

        </div>

        <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center md:pb-16 mt-4 md:mt-0">
          <RegisterHeader />
        </div>
      </div>


      <div className="flex-1 md:w-1/2 bg-bg-card rounded-t-[2.5rem] md:rounded-none -mt-8 md:mt-0 z-10 flex flex-col justify-center items-center px-6 py-10 md:py-12 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] md:shadow-none min-h-[60vh] md:min-h-0">
        <div className="w-full max-w-md flex flex-col items-center gap-6 md:gap-8">
          <RegisterForm
            form={form}
            isLoading={isLoading}
            showPassword={showPassword}
            onTogglePasswordVisibility={handleTogglePasswordVisibility}
            onSubmit={form.handleSubmit(onSubmit)}
            serverErrors={serverErrors}
          />


          <p className="mt-2 text-sm md:text-base text-text-secondary">
            {REGISTER_CONSTANTS.loginLink.prompt}{' '}
            <Link
              type="button"
              to={"/auth/login"}
              className="text-primary font-bold bg-transparent border-none cursor-pointer hover:underline p-0 transition-colors hover:text-primary/80"
            >
              {REGISTER_CONSTANTS.loginLink.link}
            </Link>
          </p>


        </div>
      </div>
    </div>
  );
}
