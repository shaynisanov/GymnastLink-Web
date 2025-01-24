import {memo} from 'react';
import {ChatBubbleOutlineRounded, EditNoteRounded, FavoriteBorderRounded} from '@mui/icons-material';
import {IconButton, Typography} from '@mui/joy';
import {PostUserSkeleton} from '@components/PostItem/PostItemSkeleton/PostUserSkeleton';
import {UserAvatar} from '@components/ProfileImage';
import {ContentCard} from '@components/common/ContentCard';
import {Post} from '@customTypes/Post';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {getUserById} from '@services/usersApi';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  post: Post;
}

const PostItem = memo<Props>(({post}) => {
  const {user} = useUserContext();
  const {data: creatingUser, isFetching: isFetchingUser} = useFetch(getUserById, [post.userId]);

  return (
    <ContentCard>
      <div className={styles.container}>
        {isFetchingUser || !creatingUser ? (
          <PostUserSkeleton />
        ) : (
          <div className={styles.header}>
            <UserAvatar userName={creatingUser.userName} />
            <div className={styles.postDetails}>
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
          {post.image && <img src={post.image} alt="post" />}
        </div>
        <div className={styles.actions}>
          <IconButton className={styles.actionButton}>
            <FavoriteBorderRounded />
            <Typography level="body-md">0</Typography>
          </IconButton>
          <IconButton className={styles.actionButton}>
            <ChatBubbleOutlineRounded />
            <Typography level="body-md">0</Typography>
          </IconButton>
          {user?._id === post.userId && (
            <IconButton className={styles.actionButton}>
              <EditNoteRounded />
            </IconButton>
          )}
        </div>
      </div>
    </ContentCard>
  );
});
export {PostItem};
