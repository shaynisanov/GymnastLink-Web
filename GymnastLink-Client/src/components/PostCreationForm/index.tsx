import {FC} from 'react';
import {useForm} from 'react-hook-form';
import {AddRounded, AttachFileRounded} from '@mui/icons-material';
import {IconButton, Typography} from '@mui/joy';
import {NewPostForm, newPostSchema} from '@components/PostCreationForm/form';
import {UserAvatar} from '@components/ProfileImage';
import {ContentCard} from '@components/common/ContentCard';
import {StyledButton} from '@components/common/StyledButton';
import {StyledTextArea} from '@components/common/input/StyledTextArea';
import {useUserContext} from '@contexts/UserContext';
import {yupResolver} from '@hookform/resolvers/yup';
import styles from './styles.module.scss';

interface Props {
  handleCreateNewPost(newPostForm: NewPostForm): Promise<void>;
}

const PostCreationForm: FC<Props> = ({handleCreateNewPost}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: {isValid},
  } = useForm<NewPostForm>({resolver: yupResolver(newPostSchema)});
  const {user} = useUserContext();

  const onSubmitClick = async (data: NewPostForm) => {
    try {
      await handleCreateNewPost(data);
      reset({content: ''});
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ContentCard>
      <div className={styles.container}>
        {user && (
          <div className={styles.header}>
            <UserAvatar userName={user.userName} />
            <div className={styles.postDetails}>
              <Typography level="body-lg" fontWeight={700}>
                {`@${user.userName}`}
              </Typography>
            </div>
          </div>
        )}
        <div className={styles.content}>
          <StyledTextArea {...register('content')} placeholder="Whats on your mind?" minRows={2} maxRows={6} />
        </div>
        <div className={styles.actions}>
          <IconButton className={styles.actionButton}>
            <AttachFileRounded />
          </IconButton>
          <StyledButton startDecorator={<AddRounded />} disabled={!isValid} onClick={handleSubmit(onSubmitClick)}>
            Share
          </StyledButton>
        </div>
      </div>
    </ContentCard>
  );
};
export {PostCreationForm};
