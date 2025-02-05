import {model, Schema, Types} from 'mongoose';

interface IWorkout {
  title: string;
  content: string;
  userId: Types.ObjectId;
  createdTime: string;
}

const workoutSchema = new Schema<IWorkout>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  createdTime: {
    type: String,
    required: true,
  },
});

const workoutModel = model('Workouts', workoutSchema);

export type {IWorkout as IWorkout};
export {workoutModel as workoutModel};
