import {FC, useState} from 'react';
import {Bolt} from '@mui/icons-material';
import {StyledButton} from '@components/common/StyledButton';
import {StyledTextArea} from '@components/common/input/StyledTextArea';
import {useUserContext} from '@contexts/UserContext';
import {toast} from 'react-toastify';
import {useMutation} from '@hooks/useMutation';
import styles from './styles.module.scss';

interface Props {
  handlePlanWorkout: (workoutDescription: string) => Promise<void>;
}

const PLACEHOLDER = `Describe your desired workout with natural language.

Example of a detailed workout description:
"I want a strength training workout focusing on upper body.
Include exercises like bench press, shoulder press, and bicep curls.
Do 3 sets of 10 reps for each exercise with 1 minute rest between sets."`;

const WorkoutAIChat: FC<Props> = ({handlePlanWorkout}) => {
  const {user} = useUserContext();
  const [workoutDescription, setWorkoutDescription] = useState<string>();
  const isValid = user && workoutDescription && workoutDescription.length > 0;
  const {trigger: planWorkout, isLoading: isPlanningWorkout} = useMutation(handlePlanWorkout);

  const handleGenerateClick = async () => {
    if (isValid) {
      try {
        await planWorkout(workoutDescription);
        setWorkoutDescription('');
      } catch (e) {
        toast.error('We couldn\'t generate your workout');
      }
    }
  };

  return (
    <div className={styles.contentContainer}>
      <StyledTextArea
        value={workoutDescription}
        placeholder={PLACEHOLDER}
        onChange={(e) => setWorkoutDescription(e.target.value)}
      />
      <StyledButton
        className={styles.generateButton}
        startDecorator={<Bolt />}
        loading={isPlanningWorkout}
        onClick={handleGenerateClick}
        disabled={!isValid}
      >
        Generate Workout
      </StyledButton>
    </div>
  );
};

export {WorkoutAIChat};
