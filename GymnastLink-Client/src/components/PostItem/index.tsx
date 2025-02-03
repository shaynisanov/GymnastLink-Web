import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react';
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
import {getCommentCount} from '@services/commentsApi';
import {handleLike} from '@services/postsApi';
import {getUserById} from '@services/usersApi';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  post: Post;
  onEditClick?: (post: Post) => void;
  onDeleteClick?: (postId: string) => void;
}

const PostItem: FC<Props> = ({post, onEditClick, onDeleteClick}) => {
  const navigate = useNavigate();
  const {user} = useUserContext();
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const {data: creatingUser, isFetching: isFetchingUser} = useFetch(getUserById, [post.userId]);
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user._id) : false);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await getCommentCount(post._id);
        setCommentCount(response);
      } catch (error) {
        console.error('Error fetching comment count', error);
      }
    };

    fetchCommentCount();
  });

  const handleLikeButton = async () => {
    try {
      await handleLike(post._id);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error(`we couldn't handle your like in the post`);
    }
  };

  const onCommentsButtonClick = useCallback(() => {
    navigate(ClientRoutes.COMMENTS, {state: {post}});
  }, [post._id, navigate]);

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
              <Typography level="body-md">{likeCount}</Typography>
            </StyledIconButton>
            <StyledIconButton onClick={onCommentsButtonClick}>
              <ChatBubbleOutlineRounded />
              <Typography level="body-md">{commentCount}</Typography>
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
};
export {PostItem};
