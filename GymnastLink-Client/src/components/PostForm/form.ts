import * as yup from 'yup';

interface PostDetailsForm {
  content: string;
  image?: string;
}

const postSchema = yup
  .object({
    content: yup.string().min(1).max(400).required(),
    image: yup.string().optional(),
  })
  .required();

const postInitialValues: PostDetailsForm = {
  content: '',
};

export type {PostDetailsForm};
export {postSchema, postInitialValues};
