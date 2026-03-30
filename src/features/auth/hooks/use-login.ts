import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LOGIN_CONSTANTS } from '../constants/login.constants';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/auth.context';


const { emailMessage, passwordMessage } = LOGIN_CONSTANTS.validation;

const loginSchema = z.object({
  email: z.email(emailMessage),
  password: z.string().min(8, passwordMessage),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface UseLoginReturn {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
  onSubmit: (values: LoginFormValues) => void;
  showPassword: boolean;
  handleTogglePasswordVisibility: () => void;
  serverErrors: string[] | null;
}

export function useLogin(): UseLoginReturn {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);


    try {
      const result = await authService.login(values);
      console.log('login success:', result);

      if (result.token) {
        login({
          token: result.token,
          name: result.name,
          companyCode: result.companyCode
        });
      }

      navigate('/dashboard/inputs');
    } catch (error: any) {
      console.error('Login error:', error.response.data.errorMessages);
      const messages = error.response?.data?.errorMessages ?? ['Ocorreu um erro ao fazer login. Tente novamente.'];
      setServerErrors(messages);
    } finally {
      setIsLoading(false);
    }
  };



  return {
    form,
    isLoading,
    onSubmit,
    showPassword,
    handleTogglePasswordVisibility,
    serverErrors
  };
}
