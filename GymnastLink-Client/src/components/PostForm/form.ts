import * as yup from 'yup';

interface PostDetailsForm {
  content: string;
  image?: File;
}

const postSchema = yup
  .object({
    content: yup.string().min(1).max(400).required(),
  })
  .required();

const postInitialValues: PostDetailsForm = {
  content: '',
};

export type {PostDetailsForm};
export {postSchema, postInitialValues};
