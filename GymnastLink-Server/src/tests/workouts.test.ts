import request from 'supertest';
import {initializeExpress} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {workoutModel} from '../models/WorkoutsModel';
import {userModel} from '../models/usersModel';
import {prepareUserForTests} from './prepareTests';

let app: Express;
let workoutId = '';
let userId = '';
let userAccessToken = '';

beforeAll(async () => {
  app = await initializeExpress();

  await workoutModel.deleteMany();
  await userModel.deleteMany();

  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;

  const workoutResponse = await request(app)
    .post('/workouts')
    .set('Authorization', `Bearer ${userAccessToken}`)
    .send({
      title: 'Test Workout',
      content: 'This is a test workout',
      createdTime: new Date().toISOString(),
    });

  workoutId = workoutResponse.body._id;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Workouts Tests', () => {
  test('get all workouts by user', async () => {
    const response = await request(app)
      .get('/workouts')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .query({filter: userId});

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toBe(workoutId);
  });

  test('create workout', async () => {
    const response = await request(app)
      .post('/workouts')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        title: 'Test Workout',
        content: 'This is a test workout',
        createdTime: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('This is a test workout');
    expect(response.body.userId).toBe(userId);
    expect(response.body.createdTime).toBeDefined();
  });

  test('plan workout', async () => {
    const response = await request(app)
      .post('/workouts/plan')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        title: 'Test Workout',
        content: 'Test Content',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

  test('delete workout', async () => {
    const response = await request(app)
      .delete(`/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
  });

  test('fail to get all workouts by user without authorization', async () => {
    const response = await request(app)
      .get('/workouts')
      .query({filter: userId});

    expect(response.statusCode).toBe(401);
  });

  test('fail to create workout without authorization', async () => {
    const response = await request(app).post('/workouts').send({
      title: 'Unauthorized Workout',
      content: 'This workout should not be created',
    });

    expect(response.statusCode).toBe(401);
  });

  test('fail to plan workout without authorization', async () => {
    const response = await request(app).post('/workouts/plan').send({
      title: 'Unauthorized Workout',
      content: 'This workout should not be planned',
    });

    expect(response.statusCode).toBe(401);
  });

  test('fail to delete workout without authorization', async () => {
    const response = await request(app).delete(`/workouts/${workoutId}`);
    expect(response.statusCode).toBe(401);
  });

  test('fail to delete non-existent workout', async () => {
    const response = await request(app)
      .delete(`/workouts/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(404);
  });
});
