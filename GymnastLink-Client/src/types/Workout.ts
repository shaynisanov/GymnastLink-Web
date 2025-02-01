interface Workout {
    _id?: string;
    title: string;
    content: string;
    userId?: string;
    createdTime?: string;
}
type WorkoutRequest = Omit<Workout, '_id'>;
export type { Workout, WorkoutRequest };