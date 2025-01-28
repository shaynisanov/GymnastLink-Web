interface Workout {
    _id: string;
    title: string;
    content: string;
    userId: string;
    createdTime: string;
}

interface WorkoutPlan {
    title: string;
    content: string;
}

type WorkoutRequest = Omit<Workout, '_id'>;
export type { Workout, WorkoutPlan, WorkoutRequest };