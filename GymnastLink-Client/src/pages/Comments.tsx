import {FC, useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Add, ArrowBack} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import CommentList from '@components/CommentList';
import {PostItem} from '@components/PostItem';
import {StyledButton} from '@components/common/StyledButton';
import {StyledInput} from '@components/common/input/StyledInput';
import {Comment} from '@customTypes/Comment';
import {Post} from '@customTypes/Post';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {createNewComment, getAllComments} from '@services/commentsApi';
import styles from '@styles/comments.module.scss';

const Comments: FC = () => {
  const {user} = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post>(location.state?.post);
  const {data: initialComments = [], isFetching} = useFetch(getAllComments, post._id);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentContent, setCommentContent] = useState<string>('');

  const showCommentLoading = useLoadingWithDelay(isFetching);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSaveComment = async () => {
    if (user) {
      try {
        const newComment = await createNewComment({
          content: commentContent,
          userId: user._id,
          postId: post._id,
          createdTime: new Date().toISOString(),
        });
        setComments(prevState => [newComment, ...prevState]);
        setPost(prevState => ({...prevState, commentCount: prevState.commentCount + 1}));

        setCommentContent('');
        toast.success('Comment was added');
      } catch (e) {
        toast.error("We couldn't add your new comment");
      }
    }
  };

  const handleReturn = useCallback(() => {
    navigate(ClientRoutes.UPDATES);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <Typography level="h2">What people say about this post</Typography>
      <Grid container spacing="32px" className={styles.grid}>
        <Grid xs={7} className={styles.postGridItem}>
          <PostItem post={post} />
          <StyledInput
            placeholder="Add a comment..."
            value={commentContent}
            className={styles.input}
            onChange={e => setCommentContent(e.target.value)}
            endDecorator={
              <StyledButton
                className={styles.addButton}
                startDecorator={<Add />}
                disabled={!user || !commentContent.trim()}
                onClick={handleSaveComment}>
                Add Comment
              </StyledButton>
            }
          />
        </Grid>
        <Grid xs={5}>
          <CommentList comments={comments} showLoading={showCommentLoading} />
        </Grid>
      </Grid>
      <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={handleReturn}>
        Return
      </StyledButton>
    </div>
  );
};

export default Comments;
