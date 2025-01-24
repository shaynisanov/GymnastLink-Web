import * as yup from 'yup';

interface NewPostForm {
  content: string;
  image?: string;
}

const newPostSchema = yup
  .object({
    content: yup.string().min(1).max(400).required(),
    image: yup.string().optional(),
  })
  .required();

export type {NewPostForm};
export {newPostSchema};
