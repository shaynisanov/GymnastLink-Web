import { Grid, Typography } from "@mui/joy";
import { useState, useEffect, useCallback } from "react";
import styles from "@styles/comments.module.scss";
import { PostItem } from "@components/PostItem";
import { useLocation } from "react-router-dom";
import CommentList from "@components/CommentList";
import { createNewComment, getAllComments } from "@services/commentsApi";
import { useUserContext } from "@contexts/UserContext";
import { useFetch } from "@hooks/useFetch";
import { useLoadingWithDelay } from "@hooks/useLoadingWithDelay";
import { Comment } from "@customTypes/Comment";
import { StyledTextArea } from "@components/common/input/StyledTextArea";
import { StyledButton } from "@components/common/StyledButton";
import { Add } from '@mui/icons-material';
import { toast } from "react-toastify";

const Comments = () => {
    const { user } = useUserContext();
    const location = useLocation();
    const post = location.state?.post;
    const fetchComments = useCallback(() => getAllComments(post._id), [post._id]);
    const { data: initialComments = [], isFetching } = useFetch(fetchComments);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentContent, setCommentContent] = useState<string>("");
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
                toast.success('Comment was added');
            } catch (e) {
                toast.error("We couldn't add your new comment");
            }
        }
    };

    return (
        <Grid container spacing="32px" className={styles.container}>
            <Grid xs={7} className={styles.gridItem}>
                <Typography level="h2">What people say about this post</Typography>
                <PostItem
                    post={post}
                    onEditClick={() => { }}
                    onDeleteClick={() => { }}
                    showEditDelete={false} />
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
                        onClick={handleSaveComment}>
                        Add Comment
                    </StyledButton>
                </div>
            </Grid>
            <Grid xs={5} className={styles.listItem}>
                <CommentList comments={comments} showLoading={showCommentLoading} />
            </Grid>
        </Grid>
    );
}

export default Comments;