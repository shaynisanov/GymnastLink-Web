import {memo} from 'react';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {Workout} from '@customTypes/Workout';
import {formatDate} from '@utils/dateUtils';
import styles from './styles.module.scss';

interface Props {
  workout: Workout;
  onClick: () => void;
}

const WorkoutItem = memo<Props>(({workout, onClick}) => (
  <ContentCard onClick={onClick} className={styles.container}>
    <Typography level="body-lg" fontWeight={700}>
      {workout.title}
    </Typography>
    <Typography level="body-md">{formatDate(workout.createdTime)}</Typography>
  </ContentCard>
));

export default WorkoutItem;
