import {memo, useCallback} from 'react';
import {ChatBubbleOutlineRounded, DeleteRounded, EditNoteRounded, FavoriteBorderRounded} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {UserSkeleton} from '@components/common/UserSkeleton';
import {UserAvatar} from '@components/ProfileImage';
import {ContentCard} from '@components/common/ContentCard';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {Post} from '@customTypes/Post';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {getUserById} from '@services/usersApi';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';
import {useNavigate} from 'react-router-dom';
import { ClientRoutes } from '@enums/clientRoutes';

interface Props {
  post: Post;
  onEditClick: (post: Post) => void;
  onDeleteClick: (postId: string) => void;
  showEditDelete?: boolean;
}

const PostItem = memo<Props>(({post, onEditClick, onDeleteClick, showEditDelete = true}) => {
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {data: creatingUser, isFetching: isFetchingUser} = useFetch(getUserById, [post.userId]);

  const onCommentsButtonClick = useCallback(() => {
    navigate(ClientRoutes.COMMENTS, { state: { post } });
  }, [post, history]);

  const onEditButtonClick = useCallback(() => {
    onEditClick(post);
  }, [post, onEditClick]);

  const onDeleteButtonClick = useCallback(() => {
    onDeleteClick(post._id);
  }, [post._id, onDeleteClick]);

  return (
    <ContentCard>
      <div className={styles.container}>
        <div className={post.imageUrl ? styles.detailsContentWithImage : styles.detailsContent}>
          {isFetchingUser || !creatingUser ? (
            <UserSkeleton />
          ) : (
            <div className={styles.header}>
              <UserAvatar userName={creatingUser.userName} />
              <div>
                <Typography level="body-lg" fontWeight={700}>
                  {`@${creatingUser.userName}`}
                </Typography>
                <Typography level="body-md">{formatDate(post.createdTime)}</Typography>
              </div>
            </div>
          )}
          <div className={styles.content}>
            <Typography level="body-lg" className={styles.text}>
              {post.content}
            </Typography>
          </div>
          <div className={styles.actions}>
            <StyledIconButton>
              <FavoriteBorderRounded />
              <Typography level="body-md">0</Typography>
            </StyledIconButton>
            <StyledIconButton onClick={onCommentsButtonClick}>
              <ChatBubbleOutlineRounded />
              <Typography level="body-md">0</Typography>
            </StyledIconButton>
            {showEditDelete && user?._id === post.userId && (
              <>
                <StyledIconButton onClick={onEditButtonClick}>
                  <EditNoteRounded />
                </StyledIconButton>
                <StyledIconButton onClick={onDeleteButtonClick}>
                  <DeleteRounded />
                </StyledIconButton>
              </>
            )}
          </div>
        </div>
        {!!post.imageUrl && post.imageUrl.length > 0 && (
          <div className={styles.postImage}>
            <img src={post.imageUrl} alt="post" />
          </div>
        )}
      </div>
    </ContentCard>
  );
});
export {PostItem};
