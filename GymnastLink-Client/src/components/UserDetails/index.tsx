import {FC} from 'react';
import {Skeleton, Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {LoggedUser} from '@customTypes/User';
import styles from './styles.module.scss';

interface Props {
  user: LoggedUser | null;
  postCount: number;
  workoutCount: number;
  isLoading: boolean;
}

const UserDetails: FC<Props> = ({user, postCount, workoutCount, isLoading}) =>
  user && !isLoading ?
    <div className={styles.profileContainer}>
      <UserAvatar user={user} sizeLg />
      <div className={styles.horizontalContainer}>
        <Typography level="h2" fontWeight={700}>
          {`@${user.userName}`}
        </Typography>
        <Typography level="h2">
          {`${workoutCount} Workouts`}
        </Typography>
        <Typography level="h2">
          {`${postCount} Posts`}
        </Typography>
      </div>
    </div> :
    <div className={styles.profileContainer}>
      <Skeleton variant="circular" width={245} height={245} />
      <div className={styles.horizontalContainer}>
        <Skeleton animation="wave" variant="text" width={200} height={40} />
        <Skeleton animation="wave" variant="text" width={100} height={40} />
        <Skeleton animation="wave" variant="text" width={100} height={40} />
      </div>
    </div>;

export {UserDetails};
