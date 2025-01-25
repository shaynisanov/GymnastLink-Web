import request from 'supertest';
import {initializeExpress} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {commentModel} from '../models/commentsModel';
import {postModel} from '../models/postsModel';
import {prepareUserForTests} from './prepareTests';

let app: Express;
let postId = '';
let userId = '';
let userAccessToken = '';

beforeAll(async () => {
  app = await initializeExpress();

  await commentModel.deleteMany();
  await postModel.deleteMany();

  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;

  const postResponse = await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${userAccessToken}`)
    .send({
      content: 'This is a test post',
      createdTime: new Date().toISOString(),
    });
  postId = postResponse.body._id;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Comments Tests', () => {
  test('get all', async () => {
    const response = await request(app)
      .get('/comments')
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test('create comment', async () => {
    const response = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        postId,
        content: 'This is a test comment',
        createdTime: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('This is a test comment');
    expect(response.body.postId).toBe(postId);
    expect(response.body.userId).toBe(userId);
    expect(response.body.createdTime).toBeDefined();
  });

  test('get comments by postId', async () => {
    const response = await request(app)
      .get(`/comments?filter=${postId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe('This is a test comment');
    expect(response.body[0].postId).toBe(postId);
    expect(response.body[0].userId).toBe(userId);
    expect(response.body[0].createdTime).toBeDefined();
  });

  test('fail to create comment without authorization', async () => {
    const response = await request(app).post('/comments').send({
      postId,
      content: 'This is a test comment without auth',
      createdTime: new Date().toISOString(),
    });

    expect(response.statusCode).toBe(401);
  });
});
