import {compareDesc} from 'date-fns';
import {FC} from 'react';
import {PostItem} from '@components/PostItem';
import {PostItemSkeleton} from '@components/PostItem/PostItemSkeleton';
import {Post} from '@customTypes/Post';
import styles from './styles.module.scss';

interface Props {
  posts: Post[];
  showLoading: boolean;
}

const PostList: FC<Props> = ({posts, showLoading}) => (
  <div className={styles.container}>
    {showLoading
      ? Array.from({length: 5}).map((_, index) => <PostItemSkeleton key={index} />)
      : posts
          ?.sort((a, b) => compareDesc(a.createdTime, b.createdTime))
          .map((post) => <PostItem post={post} key={post._id} />)}
  </div>
);

export {PostList};
