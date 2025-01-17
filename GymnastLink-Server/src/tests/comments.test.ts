import request from 'supertest';
import {initializeExpress} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {commentModel} from '../models/commentsModel';
import {postModel} from '../models/postsModel';
import {userModel} from '../models/usersModel';

let app: Express;
let commentId = '';
let postId = '';
let userId = '';
let userAccessToken = '';

beforeAll(async () => {
  app = await initializeExpress();

  const exampleUserDetails = {
    email: 'testuser@example.com',
    password: 'password123',
  };

  await commentModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany();

  const userResponse = await request(app)
    .post('/users/register')
    .send(exampleUserDetails);

  const loginResponse = await request(app)
    .post('/users/login')
    .send(exampleUserDetails);

  userAccessToken = loginResponse.body.accessToken;

  const postResponse = await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${userAccessToken}`)
    .send({
      title: 'Test Post',
      content: 'This is a test post',
    });

  userId = userResponse.body._id;
  postId = postResponse.body._id;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Comments Tests', () => {
  test('get all', async () => {
    const response = await request(app).get('/comments');

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
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('This is a test comment');
    expect(response.body.postId).toBe(postId);
    expect(response.body.userId).toBe(userId);
    commentId = response.body._id;
  });

  test('get comments by postId', async () => {
    const response = await request(app).get(`/comments?filter=${postId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe('This is a test comment');
    expect(response.body[0].postId).toBe(postId);
    expect(response.body[0].userId).toBe(userId);
  });

  test('get comment by id', async () => {
    const response = await request(app).get(`/comments/${commentId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe('This is a test comment');
    expect(response.body.postId).toBe(postId);
    expect(response.body.userId).toBe(userId);
  });

  test('update comment', async () => {
    const response = await request(app)
      .put(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        content: 'Updated test comment',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe('Updated test comment');
  });

  test('delete comment', async () => {
    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
  });

  test('fail to create comment without authorization', async () => {
    const response = await request(app).post('/comments').send({
      postId,
      content: 'This is a test comment without auth',
    });

    expect(response.statusCode).toBe(401);
  });

  test('fail to update non-existent comment', async () => {
    const response = await request(app)
      .put(`/comments/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        content: 'Trying to update non-existent comment',
      });

    expect(response.statusCode).toBe(404);
  });

  test('fail to delete non-existent comment', async () => {
    const response = await request(app)
      .delete(`/comments/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(404);
  });
});
