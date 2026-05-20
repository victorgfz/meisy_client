import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { REGISTER_CONSTANTS } from '../constants/register.constants';
import { authService } from '../services/auth.service';
import { useAuthContext } from '../contexts/auth.context';
import { getDateCorrected } from '../../../lib/date-corrected';

const { nameMessage, emailMessage, passwordMessage, companyCodeMessage } = REGISTER_CONSTANTS.validation;

const registerSchema = z.object({
  name: z.string().min(2, nameMessage),
  email: z.email(emailMessage),
  password: z.string().min(8, passwordMessage).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, passwordMessage),
  joinCompany: z.enum(['yes', 'no']),
  companyCode: z.string().optional(),
}).superRefine((data, ctx) => {

  if (data.joinCompany === 'yes') {
    if (!data.companyCode || !/^[a-zA-Z0-9]{6}$/.test(data.companyCode)) {
      ctx.addIssue({
        code: "custom",
        message: companyCodeMessage,
        path: ['companyCode'],
      });
    }
  }
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface UseRegisterReturn {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
  showPassword: boolean;
  handleTogglePasswordVisibility: () => void;
  onSubmit: (values: RegisterFormValues) => void;
  serverErrors: string[] | null;
}

export function useRegister(): UseRegisterReturn {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      joinCompany: 'no',
      companyCode: '',
      //confirmPassword: '',
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setServerErrors(null);

    try {
      const result = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        companyCode: values.companyCode ? values.companyCode : null,
        createdAt: getDateCorrected(new Date()),
        updatedAt: getDateCorrected(new Date()),
      });

      if (result.token) {
        login({
          token: result.token,
          name: result.name,
          companyCode: result.companyCode
        });
      }

      navigate('/dashboard/inputs');
    } catch (error: any) {
      const messages = error.response?.data?.errorMessages ?? ['Ocorreu um erro ao registrar. Tente novamente.'];
      setServerErrors(messages);
    } finally {
      setIsLoading(false);
    }
  };



  return {
    form,
    isLoading,
    showPassword,
    handleTogglePasswordVisibility,
    onSubmit,
    serverErrors
  };
}
