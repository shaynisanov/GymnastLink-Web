import {compareDesc} from 'date-fns';
import {FC} from 'react';
import {ContentCard} from '@components/common/ContentCard';
import {Workout} from '@customTypes/Workout';
import WorkoutItem from '../WorkoutItem';
import {WorkoutItemSkeleton} from '../WorkoutItem/WorkoutItemSkeleton';
import styles from './styles.module.scss';

interface Props {
  workouts: Workout[];
  showLoading: boolean;
  onWorkoutClick: (workout: Workout) => void;
}

const WorkoutList: FC<Props> = ({workouts, showLoading, onWorkoutClick}) => (
  <ContentCard className={styles.container}>
    {showLoading
      ? Array.from({length: 5}).map((_, index) => <WorkoutItemSkeleton key={index} />)
      : workouts
        .filter((workout) => !!workout._id && !!workout.createdTime)
        .sort((a, b) => compareDesc(a.createdTime!, b.createdTime!))
        .map((workout) => (
          <WorkoutItem workout={workout} key={workout._id} onClick={() => onWorkoutClick(workout)} />
        ))}
  </ContentCard>
);

export default WorkoutList;
