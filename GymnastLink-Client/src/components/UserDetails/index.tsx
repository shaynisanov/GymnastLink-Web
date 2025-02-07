import {ChangeEvent, FC, useRef} from 'react';
import {Skeleton, Typography} from '@mui/joy';
import {UserAvatar} from '@components/UserAvatar';
import {LoggedUser} from '@customTypes/User';
import styles from './styles.module.scss';

interface Props {
  user: LoggedUser | null;
  postCount: number;
  workoutCount: number;
  isLoading: boolean;
  onUpdateProfilePicture: (file: File) => void;
}

const UserDetails: FC<Props> = ({user, postCount, workoutCount, isLoading, onUpdateProfilePicture}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onUpdateProfilePicture(file);
    }
  };

  return user && !isLoading ? (
    <div className={styles.profileContainer}>
      <UserAvatar className={styles.avatar} user={user} sizeLg onClick={() => fileInputRef.current?.click()} />
      <input type="file" ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleFileChange} />
      <div className={styles.detailsContainer}>
        <Typography level="h2" fontWeight={700}>
          {`@${user.userName}`}
        </Typography>
        <Typography level="h2">{`${workoutCount} Workouts`}</Typography>
        <Typography level="h2">{`${postCount} Posts`}</Typography>
      </div>
    </div>
  ) : (
    <div className={styles.profileContainer}>
      <Skeleton variant="circular" width={245} height={245} />
      <div className={styles.detailsContainer}>
        <Skeleton animation="wave" variant="text" width={200} height={40} />
        <Skeleton animation="wave" variant="text" width={100} height={40} />
        <Skeleton animation="wave" variant="text" width={100} height={40} />
      </div>
    </div>
  );
};

export {UserDetails};
