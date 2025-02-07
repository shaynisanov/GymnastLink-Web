import {Workout, WorkoutRequest} from '@customTypes/Workout';
import {ServerRoutes} from '@enums/serverRoutes';
import {axiosInstance} from '@services/axiosConfig';

const getUserWorkouts = async () => {
  const response = await axiosInstance.get<Workout[]>(`/${ServerRoutes.WORKOUTS}`);

  return response.data;
};

const createNewWorkout = async (newWorkout: WorkoutRequest) => {
  const response = await axiosInstance.post<Workout>(`/${ServerRoutes.WORKOUTS}`, newWorkout);

  return response.data;
};

const planWorkout = async (description: string) => {
  const response = await axiosInstance.post<Workout>(`/${ServerRoutes.WORKOUTS}/plan`, {description});

  return response.data;
};

const deleteWorkout = async (workoutId: string) => {
  await axiosInstance.delete(`/${ServerRoutes.WORKOUTS}/${workoutId}`);
};

export {getUserWorkouts, createNewWorkout, planWorkout, deleteWorkout};
