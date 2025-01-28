import { FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Grid, Typography } from '@mui/joy';
import styles from '@styles/updates.module.scss';
import WorkoutAIChat from '@components/workoutComponents/WorkoutAIChat';
import WorkoutList from '@components/workoutComponents/WorkoutList';
import { useUserContext } from '@contexts/UserContext';
import { getAllByUser, createNewWorkout, planWorkout, deleteWorkout } from '@services/workoutApi';
import { Popup } from '@components/common/Popup';
import WorkoutForm from '@components/workoutComponents/WorkoutForm';
import { Workout, WorkoutPlan } from '@customTypes/Workout';
import { useLoadingWithDelay } from '@hooks/useLoadingWithDelay';
import { useFetch } from '@hooks/useFetch';

const Workouts: FC = () => {
  const { user } = useUserContext();
  const fetchWorkouts = useCallback(() => getAllByUser(user?._id || ''), [user?._id]);
  const { data: initialWorkouts = [], isFetching } = useFetch(fetchWorkouts);
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const showWorkoutLoading = useLoadingWithDelay(isFetching);

  useEffect(() => {
    setWorkouts(initialWorkouts);
  }, [initialWorkouts]);

  const handlePlanWorkout = async (workoutDescription: string) => {
    if (user) {
      try {
        const generatedWorkout = await planWorkout(workoutDescription);
        setGeneratedWorkout(generatedWorkout);
        console.log(generatedWorkout);
      } catch (e) {
        toast.error("We couldn't generate your workout");
      }
    }
  };

  const handleSaveWorkout = async () => {
    if (user) {
      try {
        const newWorkout = await createNewWorkout({
          title: generatedWorkout?.title || '',
          content: generatedWorkout?.content || '',
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
      setWorkouts((prevState) => prevState.filter(({ _id }) => _id !== workoutId));
      onCancelworkout();
      toast.success('Workout was successfully deleted');
    } catch (e) {
      toast.error("We couldn't delete your workout");
    }
  };

  const onCancelworkout = useCallback(() => {
    setGeneratedWorkout(null);
    setSelectedWorkout(null);
  }, []);

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
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
      <Popup open={!!generatedWorkout || !!selectedWorkout}
        title={generatedWorkout?.title || selectedWorkout?.title || 'Workout Plan'}
        onCancel={onCancelworkout}>
        {generatedWorkout ? (
          <WorkoutForm
            buttonText='Save'
            workoutDescription={generatedWorkout?.content || ''}
            handleButtonClick={handleSaveWorkout}
          />
        ) : (
          <WorkoutForm
            buttonText='Delete'
            workoutDescription={selectedWorkout?.content || ''}
            handleButtonClick={() =>
              selectedWorkout ?
                handleDeleteWorkout(selectedWorkout._id) :
                Promise.resolve()} />
        )}
      </Popup>
    </Grid>
  );
};

export default Workouts;
