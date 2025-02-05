import {memo, useCallback, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {
  ChatBubbleOutlineRounded,
  DeleteRounded,
  EditNoteRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
} from '@mui/icons-material';
import {Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {ContentCard} from '@components/common/ContentCard';
import {StyledIconButton} from '@components/common/StyledIconButton';
import {UserSkeleton} from '@components/common/UserSkeleton';
import {Post} from '@customTypes/Post';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {handleLike} from '@services/postsApi';
import {getUserById} from '@services/usersApi';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  post: Post;
  onEditClick?: (post: Post) => void;
  onDeleteClick?: (postId: string) => void;
}

const PostItem = memo<Props>(({post, onEditClick, onDeleteClick}) => {
  const navigate = useNavigate();
  const {user} = useUserContext();
  const [likes, setLikes] = useState(post.likes);
  const {data: creatingUser, isFetching: isFetchingUser} = useFetch(getUserById, post.userId);

  const handleLikeButton = async () => {
    if (user) {
      try {
        await handleLike(post._id);

        if (isLiked) {
          setLikes(prevState => prevState.filter(id => id !== user._id));
        } else {
          setLikes(prevState => [...prevState, user._id]);
        }
      } catch (error) {
        toast.error(`We couldn't handle your like in the post`);
      }
    }
  };

  const isLiked = useMemo(() => (user ? likes.includes(user._id) : false), [likes, user]);

  const onCommentsButtonClick = useCallback(() => {
    navigate(ClientRoutes.COMMENTS, {state: {post}});
  }, [navigate, post]);

  const onEditButtonClick = useCallback(() => {
    onEditClick?.(post);
  }, [post, onEditClick]);

  const onDeleteButtonClick = useCallback(() => {
    onDeleteClick?.(post._id);
  }, [post._id, onDeleteClick]);

  return (
    <ContentCard>
      <div className={styles.container}>
        <div className={post.imageUrl ? styles.detailsContentWithImage : styles.detailsContent}>
          {isFetchingUser || !creatingUser ? (
            <UserSkeleton />
          ) : (
            <div className={styles.header}>
              <UserAvatar user={creatingUser} />
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
            <StyledIconButton onClick={handleLikeButton}>
              {isLiked ? <FavoriteRounded /> : <FavoriteBorderRounded />}
              <Typography level="body-md">{likes.length}</Typography>
            </StyledIconButton>
            <StyledIconButton onClick={onCommentsButtonClick}>
              <ChatBubbleOutlineRounded />
              <Typography level="body-md">{post.commentCount}</Typography>
            </StyledIconButton>
            {onEditClick && onDeleteClick && user?._id === post.userId && (
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
