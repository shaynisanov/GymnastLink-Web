import {FC, useState} from 'react';
import {Bolt} from '@mui/icons-material';
import {StyledButton} from '@components/common/StyledButton';
import {StyledTextArea} from '@components/common/input/StyledTextArea';
import {useUserContext} from '@contexts/UserContext';
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
  const [workoutDescription, setWorkoutDescription] = useState<string>('');

  const handleGenerateClick = async () => {
    if (user) {
      try {
        await handlePlanWorkout(workoutDescription);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className={styles.contentContainer}>
      <StyledTextArea
        placeholder={PLACEHOLDER}
        value={workoutDescription}
        onChange={(e) => setWorkoutDescription(e.target.value)}
      />
      <StyledButton
        className={styles.generateButton}
        startDecorator={<Bolt />}
        onClick={handleGenerateClick}
        disabled={!user || !workoutDescription.trim()}
      >
        Generate Workout
      </StyledButton>
    </div>
  );
};

export default WorkoutAIChat;
