import {memo} from 'react';
import {Skeleton} from '@mui/joy';
import styles from './styles.module.scss';

const UserSkeleton = memo(() => (
  <div className={styles.container}>
    <Skeleton variant="circular" animation="wave" width={45} height={45} />
    <div className={styles.skeletonDetails}>
      <Skeleton variant="text" animation="wave" width={100} height={20} />
      <Skeleton variant="text" animation="wave" width={60} height={20} />
    </div>
  </div>
));
export {UserSkeleton};
