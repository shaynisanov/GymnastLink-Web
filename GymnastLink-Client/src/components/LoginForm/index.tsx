import {AxiosError} from 'axios';
import {FC} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {LoginRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {StyledButton} from '@components/common/StyledButton';
import {FormInput} from '@components/common/input/FormInput';
import {ClientRoutes} from '@enums/clientRoutes';
// @ts-ignore
import GoogleIcon from '@assets/Google-logo.svg?react';
import {useUserContext} from '@contexts/UserContext';
import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@hooks/useMutation';
import {GoogleLogin} from '@react-oauth/google';
import {registerUser, userLogin} from '@services/authApi';
import {UserLoginForm, loginSchema} from './form';
import styles from './styles.module.scss';

const LoginForm: FC = () => {
  const {
    handleSubmit,
    control,
    formState: {isValid},
  } = useForm<UserLoginForm>({resolver: yupResolver(loginSchema)});
  const navigate = useNavigate();
  const {setUser} = useUserContext();

  const {trigger: register, isLoading: isRegistering} = useMutation(registerUser);
  const {trigger: login, isLoading: isLoggingIn} = useMutation(userLogin);

  const handleRegistration = async (loginForm: UserLoginForm) => {
    try {
      await register(loginForm);
      toast.success('Registration successful! You can now login');
    } catch (e) {
      toast.error(`Error registering user: ${(e as AxiosError)?.response?.data}`);
    }
  };

  const handleLogin = async (loginForm: UserLoginForm) => {
    try {
      const user = await login(loginForm);
      setUser(user);
      navigate(ClientRoutes.UPDATES);

      toast.success(`Welcome back, ${user.userName}`);
    } catch (e) {
      toast.error(`Error logging in: ${(e as AxiosError)?.response?.data}`);
    }
  };

  return (
    <div className={styles.container}>
      <Typography level="h4">Login / Register</Typography>
      <FormInput
        control={control}
        formKey="email"
        inputLabel="Email"
        inputMode="email"
        placeholder="Enter your email"
      />
      <FormInput
        control={control}
        formKey="password"
        inputLabel="Password"
        type="password"
        placeholder="Enter your password"
      />
      <div className={styles.actionsContainer}>
        <GoogleLogin onSuccess={() => console.log('yey')} onError={() => console.log('error')} />
        <div className={styles.loginRegister}>
          <StyledButton disabled={!isValid} loading={isRegistering} onClick={handleSubmit(handleRegistration)}>
            Register
          </StyledButton>
          <StyledButton
            disabled={!isValid}
            loading={isLoggingIn}
            onClick={handleSubmit(handleLogin)}
            startDecorator={<LoginRounded />}
          >
            Login
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export {LoginForm};
