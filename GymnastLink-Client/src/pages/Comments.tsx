import {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Add, ArrowBack} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import CommentList from '@components/CommentList';
import {PostItem} from '@components/PostItem';
import {StyledButton} from '@components/common/StyledButton';
import {StyledTextArea} from '@components/common/input/StyledTextArea';
import {Comment} from '@customTypes/Comment';
import {ClientRoutes} from '@enums/clientRoutes';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {createNewComment, getAllComments} from '@services/commentsApi';
import styles from '@styles/comments.module.scss';

const Comments = () => {
  const {user} = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;
  const fetchComments = useCallback(() => getAllComments(post._id), [post._id]);
  const {data: initialComments = [], isFetching} = useFetch(fetchComments);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentContent, setCommentContent] = useState<string>('');
  const showCommentLoading: boolean = useLoadingWithDelay(isFetching);

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
        setComments((prevState) => [newComment, ...prevState]);
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
    <Grid container spacing="32px" className={styles.container}>
      <Grid xs={7} className={styles.gridItem}>
        <Typography level="h2">What people say about this post</Typography>
        <PostItem post={post} />
        <div className={styles.divider} />
        <div className={styles.commentContent}>
          <StyledTextArea
            placeholder="Add a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <StyledButton
            className={styles.button}
            startDecorator={<Add />}
            disabled={!user || !commentContent.trim()}
            onClick={handleSaveComment}
          >
            Add Comment
          </StyledButton>
        </div>
      </Grid>
      <Grid xs={5} className={styles.listItem}>
        <CommentList comments={comments} showLoading={showCommentLoading} />
      </Grid>
      <StyledButton className={styles.returnButton} startDecorator={<ArrowBack />} onClick={handleReturn}>
        Return
      </StyledButton>
    </Grid>
  );
};

export default Comments;
