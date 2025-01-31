import {memo} from 'react';
import {Typography} from '@mui/joy';
import {ContentCard} from '@components/common/ContentCard';
import {Workout} from '@customTypes/Workout';
import {formatDate} from '@utils/dateUtils';

interface Props {
  workout: Workout;
  onClick: () => void;
}

const WorkoutItem = memo<Props>(({workout, onClick}) => (
  <div onClick={onClick} style={{cursor: 'pointer'}}>
    <ContentCard>
      <Typography level="body-lg" fontWeight={700}>
        {workout.title}
      </Typography>
      <Typography level="body-md">{formatDate(workout.createdTime)}</Typography>
    </ContentCard>
  </div>
));

export default WorkoutItem;
