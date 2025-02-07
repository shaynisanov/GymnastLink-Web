import {FC} from 'react';
import CommentItem from '@components/CommentItem';
import {CommentItemSkeleton} from '@components/CommentItem/CommentItemSkeleton';
import {ContentCard} from '@components/common/ContentCard';
import {Comment} from '@customTypes/Comment';
import styles from './styles.module.scss';

interface Props {
  comments: Comment[];
  showLoading: boolean;
}

const CommentList: FC<Props> = ({comments, showLoading}) => (
  <ContentCard>
    <div className={styles.container}>
      {showLoading
        ? Array.from({length: 5}).map((_, index) => <CommentItemSkeleton key={index} />)
        : comments.map(comment => <CommentItem key={comment._id} comment={comment} />)}
    </div>
  </ContentCard>
);

export default CommentList;
