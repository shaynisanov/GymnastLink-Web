import {memo} from 'react';
import {Skeleton} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {UserSkeleton} from '@components/common/UserSkeleton';
import styles from './styles.module.scss';

const PostItemSkeleton = memo(() => (
  <ContentCard>
    <div className={styles.container}>
      <UserSkeleton />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="80%" height={20} />
      <Skeleton variant="text" width="90%" height={20} />
      <div className={styles.actions}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </div>
    </div>
  </ContentCard>
));

export {PostItemSkeleton};
