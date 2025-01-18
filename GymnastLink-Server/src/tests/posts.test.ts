import request from 'supertest';
import {initializeExpress} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {postModel} from '../models/postsModel';
import {userModel} from '../models/usersModel';

let app: Express;
let postId = '';
let userId = '';
let userAccessToken = '';

beforeAll(async () => {
  app = await initializeExpress();

  const exampleUserDetails = {
    email: 'testuser@example.com',
    password: 'password123',
  };

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

describe('Posts Tests', () => {
  test('get all posts', async () => {
    const response = await request(app).get('/posts');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toBe(postId);
  });

  test('create post', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Test Post');
    expect(response.body.content).toBe('This is a test post');
    expect(response.body.userId).toBe(userId);
  });

  test('get post by id', async () => {
    const response = await request(app).get(`/posts/${postId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Test Post');
    expect(response.body.content).toBe('This is a test post');
    expect(response.body.userId).toBe(userId);
  });

  test('update post', async () => {
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        title: 'Updated Test Post',
        content: 'Updated test content',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Updated Test Post');
    expect(response.body.content).toBe('Updated test content');
  });

  test('delete post', async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
  });

  test('fail to create post without authorization', async () => {
    const response = await request(app).post('/posts').send({
      title: 'Unauthorized Post',
      content: 'This post should not be created',
    });

    expect(response.statusCode).toBe(401);
  });

  test('fail to update non-existent post', async () => {
    const response = await request(app)
      .put(`/posts/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        title: 'Non-existent Post',
        content: 'Trying to update non-existent post',
      });

    expect(response.statusCode).toBe(404);
  });

  test('fail to delete non-existent post', async () => {
    const response = await request(app)
      .delete(`/posts/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(404);
  });
});
