import {FC, useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {Grid, Typography} from '@mui/joy';
import {Popup} from '@components/common/Popup';
import WorkoutAIChat from '@components/workoutComponents/WorkoutAIChat';
import WorkoutDetails from '@components/workoutComponents/WorkoutDetails';
import WorkoutList from '@components/workoutComponents/WorkoutList';
import {Workout} from '@customTypes/Workout';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {createNewWorkout, deleteWorkout, getAllByUser, planWorkout} from '@services/workoutApi';
import styles from '@styles/updates.module.scss';

const Workouts: FC = () => {
  const {user} = useUserContext();
  const fetchWorkouts = useCallback(() => getAllByUser(), []);
  const {data: initialWorkouts = [], isFetching} = useFetch(fetchWorkouts);
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [displayedWorkout, setDisplayedWorkout] = useState<Workout | null>(null);
  const showWorkoutLoading = useLoadingWithDelay(isFetching);

  useEffect(() => {
    setWorkouts(initialWorkouts);
  }, [initialWorkouts]);

  const handlePlanWorkout = async (workoutDescription: string) => {
    if (user) {
      try {
        const generatedWorkout = await planWorkout(workoutDescription);
        setDisplayedWorkout(generatedWorkout);
      } catch (e) {
        toast.error("We couldn't generate your workout");
      }
    }
  };

  const handleSaveWorkout = async () => {
    if (user) {
      try {
        const newWorkout = await createNewWorkout({
          title: displayedWorkout?.title || '',
          content: displayedWorkout?.content || '',
          userId: user._id,
          createdTime: new Date().toISOString(),
        });
        setWorkouts((prevState) => [newWorkout, ...prevState]);
        onCancelworkout();
        toast.success('The workout was added');
      } catch (e) {
        toast.error("We couldn't add your new workout");
      }
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await deleteWorkout(workoutId);
      setWorkouts((prevState) => prevState.filter(({_id}) => _id !== workoutId));
      onCancelworkout();
      toast.success('Workout was successfully deleted');
    } catch (e) {
      toast.error("We couldn't delete your workout");
    }
  };

  const onCancelworkout = () => {
    setDisplayedWorkout(null);
  };

  const handleWorkoutClick = (workout: Workout) => {
    setDisplayedWorkout(workout);
  };

  return (
    <Grid container spacing="32px" className={styles.container}>
      <Grid xs={7} className={styles.gridItem}>
        <Typography level="h2">Create new workout with AI</Typography>
        <WorkoutAIChat handlePlanWorkout={handlePlanWorkout} />
      </Grid>
      <Grid xs={5} className={styles.gridItem}>
        <Typography level="h2">Your workouts</Typography>
        <WorkoutList workouts={workouts} showLoading={showWorkoutLoading} onWorkoutClick={handleWorkoutClick} />
      </Grid>
      <Popup open={!!displayedWorkout} title={displayedWorkout?.title || 'Workout Plan'} onCancel={onCancelworkout}>
        <WorkoutDetails
          buttonText={displayedWorkout?._id ? 'Delete' : 'Save'}
          workoutDescription={displayedWorkout?.content}
          handleButtonClick={() =>
            displayedWorkout && displayedWorkout._id ? handleDeleteWorkout(displayedWorkout._id) : handleSaveWorkout()
          }
        />
      </Popup>
    </Grid>
  );
};

export default Workouts;
