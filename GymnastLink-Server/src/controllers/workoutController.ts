import {Request, Response} from 'express';
import {BaseController} from './baseController';
import {IWorkout, workoutModel} from '../models/WorkoutsModel';
import {createPrompt, WorkoutPlan} from '../types/WorkoutConfig';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {RequestWithUserId} from '../types/request';

class WorkoutController extends BaseController<IWorkout> {
  constructor() {
    super(workoutModel);
  }

  async generateWorkoutPlan(prompt: any): Promise<WorkoutPlan> {
    const aiApiKey = process.env.AI_API_KEY;

    if (!aiApiKey) {
      throw new Error('AI_API_KEY is not defined.');
    }

    const genAI = new GoogleGenerativeAI(aiApiKey);
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
    const result = await model.generateContent(prompt);

    try {
      return JSON.parse(
        result.response.text().split('json')[1].split('```')[0]
      ) as WorkoutPlan;
    } catch (e) {
      throw new Error('Failed to generate trip plan. Error: ' + e);
    }
  }

  async planWorkout(req: Request, res: Response) {
    const workoutDescription = req.body;

    try {
      const workoutPlanPrompt = createPrompt(workoutDescription);
      const workoutPlan = await this.generateWorkoutPlan(workoutPlanPrompt);

      if (!workoutPlan) {
        res.status(500).json({error: 'Failed to generate workout plans.'});
      }

      res.json(workoutPlan);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      res.status(500).json({error: 'Failed to plan the workout.'});
    }
  }

  async getAllByUser(req: RequestWithUserId, res: Response) {
    try {
      const items = await this.model.find({userId: req.body.userId});
      res.send(items);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new WorkoutController();
