import { useState, type FormEvent } from 'react';

interface UseLoginReturn {
  email: string;
  password: string;
  isLoading: boolean;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleForgotPassword: () => void;
  handleSocialLogin: (provider: 'google' | 'facebook') => void;
  handleSignup: () => void;
}

export function useLogin(): UseLoginReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // TODO: integrate with auth service
    console.log('Login attempt:', { email, password });

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    // TODO: navigate to forgot-password route
    console.log('Navigate to forgot password');
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // TODO: integrate with social auth provider
    console.log(`Social login with: ${provider}`);
  };

  const handleSignup = () => {
    // TODO: navigate to signup route
    console.log('Navigate to signup');
  };

  return {
    email,
    password,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleForgotPassword,
    handleSocialLogin,
    handleSignup,
  };
}
