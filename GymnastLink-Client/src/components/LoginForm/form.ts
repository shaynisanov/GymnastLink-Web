import * as yup from 'yup';

interface UserLoginForm {
  email: string;
  password: string;
}

const loginSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(4).max(12).required(),
  })
  .required();

export type {UserLoginForm};
export {loginSchema};
