import { Workout, WorkoutRequest } from "@customTypes/Workout";
import { ServerRoutes } from "@enums/serverRoutes";
import { axiosInstance } from "@services/axiosConfig";

const getAllByUser = async(userId: string) => {
    const response = await axiosInstance.get<Workout[]>(`/${ServerRoutes.WORKOUTS}`, {
        params: {
            filter: userId
        }
    });

    return response.data;
};

const createNewWorkout = async(newWorkout: WorkoutRequest) => {
    const response = await axiosInstance.post<Workout>(`/${ServerRoutes.WORKOUTS}`, newWorkout);

    return response.data;
};

const planWorkout = async(workoutDescription: string) => {
    const response = await axiosInstance.post<Workout>(`/${ServerRoutes.WORKOUTS}/plan`, workoutDescription);

    return response.data;
};

const deleteWorkout = async(workoutId: string) => {
    await axiosInstance.delete(`/${ServerRoutes.WORKOUTS}/${workoutId}`);
};

export { getAllByUser, createNewWorkout, planWorkout, deleteWorkout };