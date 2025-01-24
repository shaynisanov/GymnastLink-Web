import {ChangeEvent, FC, useCallback, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {AddRounded, AttachFileRounded, DeleteRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {PostDetailsForm, postInitialValues, postSchema} from '@components/PostForm/form';
import {UserAvatar} from '@components/ProfileImage';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {StyledTextArea} from '@components/common/input/StyledTextArea';
import {Post} from '@customTypes/Post';
import {useUserContext} from '@contexts/UserContext';
import {yupResolver} from '@hookform/resolvers/yup';
import styles from './styles.module.scss';

interface Props {
  submitText: string;
  post?: Post;

  handleSubmitPost(newPostForm: PostDetailsForm): Promise<void>;
}

const PostForm: FC<Props> = ({submitText, handleSubmitPost, post}) => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: {isValid},
  } = useForm<PostDetailsForm>({resolver: yupResolver(postSchema), defaultValues: post ?? postInitialValues});
  const {user} = useUserContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmitClick = async (data: PostDetailsForm) => {
    await handleSubmitPost(data);
    reset(postInitialValues);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onRemoveImage = useCallback(() => {
    setValue('image', '');
  }, [setValue]);

  return (
    <ContentCard>
      <div className={styles.container}>
        {user && (
          <div className={styles.header}>
            <UserAvatar userName={user.userName} />
            <Typography level="body-lg" fontWeight={700}>
              {`@${user.userName}`}
            </Typography>
          </div>
        )}
        <div className={styles.content}>
          <StyledTextArea
            {...register('content')}
            placeholder="What's on your mind?"
            minRows={2}
            maxRows={post ? 3 : 6}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{display: 'none'}}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className={styles.actions}>
          {watch().image ? (
            <div className={styles.imagePreview}>
              <img src={watch().image} alt="Preview" />
              <StyledButton startDecorator={<DeleteRounded />} onClick={onRemoveImage}>
                Remove Image
              </StyledButton>
            </div>
          ) : (
            <StyledIconButton onClick={() => fileInputRef.current?.click()}>
              <AttachFileRounded />
            </StyledIconButton>
          )}
          <StyledButton startDecorator={<AddRounded />} disabled={!isValid} onClick={handleSubmit(onSubmitClick)}>
            {submitText}
          </StyledButton>
        </div>
      </div>
    </ContentCard>
  );
};
export {PostForm};
