import { ContentCard } from "@components/common/ContentCard";
import { UserAvatar } from "@components/ProfileImage";
import { Typography } from "@mui/joy";
import styles from "./styles.module.scss";
import { memo } from "react";
import { Comment } from "@customTypes/Comment";
import { useFetch } from "@hooks/useFetch";
import { getUserById } from "@services/usersApi";
import { UserSkeleton } from "@components/common/UserSkeleton";
import { formatDate } from "@utils/dateUtils";

interface Props {
    comment: Comment;
}

const CommentItem = memo<Props>(({ comment }) => {
    const { data: creatingUser, isFetching: isFetchingUser } = useFetch(getUserById, [comment.userId]);

    return (
        <ContentCard>
            <div className={styles.container}>
                <div className={styles.detailsContent}>
                    {isFetchingUser || !creatingUser ? (
                        <UserSkeleton />
                    ) : (
                        <div className={styles.header}>
                            <UserAvatar userName={creatingUser.userName} />
                            <div>
                                <Typography level="body-lg" fontWeight={700}>
                                    {`@${creatingUser.userName}`}
                                </Typography>
                                <Typography level="body-md">{formatDate(comment.createdTime)}</Typography>
                            </div>
                        </div>
                    )}
                    <div className={styles.content}>
                        <Typography level="body-lg" className={styles.text}>
                            {comment.content}
                        </Typography>
                    </div>
                </div>
            </div>
        </ContentCard>
    );
});

export default CommentItem;