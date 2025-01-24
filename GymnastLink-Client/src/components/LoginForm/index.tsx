import {yupResolver} from '@hookform/resolvers/yup';
import {registerUser, userLogin} from '@services/authApi';
import {AxiosError} from 'axios';
import {FC, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {LoginRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
// @ts-ignore
import GoogleIcon from '@assets/Google-logo.svg?react';
import {StyledButton} from '@components/common/StyledButton';
import {FormInput} from '@components/common/input/FormInput';
import {useUserContext} from '@contexts/UserContext';
import {ClientRoutes} from '@enums/clientRoutes';
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

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleRegistration = async (loginForm: UserLoginForm) => {
    setIsRegistering(true);

    try {
      const newUser = await registerUser(loginForm);
      setUser(newUser);

      toast.success('Registration successful! You can now login');
    } catch (e) {
      toast.error(`Error registering user: ${(e as AxiosError)?.response?.data}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogin = async (loginForm: UserLoginForm) => {
    setIsLoggingIn(true);

    try {
      const user = await userLogin(loginForm);
      setUser(user);
      navigate(ClientRoutes.UPDATES);

      toast.success(`Welcome back, ${user.userName}`);
    } catch (e) {
      toast.error(`Error logging in: ${(e as AxiosError)?.response?.data}`);
    } finally {
      setIsLoggingIn(false);
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
        <StyledButton startDecorator={<GoogleIcon />}>Login With Google</StyledButton>
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
