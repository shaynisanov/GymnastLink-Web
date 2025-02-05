import request from 'supertest';
import {initializeExpress} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {postModel} from '../models/postsModel';
import {prepareUserForTests} from './prepareTests';

let app: Express;
let postId = '';
let userId = '';
let userAccessToken = '';

beforeAll(async () => {
  app = await initializeExpress();

  await postModel.deleteMany();

  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;

  const postResponse = await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${userAccessToken}`)
    .send({
      content: 'This is a test post',
      imageUrl: null,
      createdTime: new Date().toISOString(),
    });

  postId = postResponse.body._id;
});

afterAll((done) => {
  postModel.deleteMany({userId}).then(() => {
    mongoose.connection.close();
    done();
  });
});

describe('Posts Tests', () => {
  test('get all posts', async () => {
    const response = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toBe(postId);
  });

  test('create post', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        content: 'This is a test post',
        imageUrl: null,
        createdTime: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('This is a test post');
    expect(response.body.userId).toBe(userId);
    expect(response.body.createdTime).toBeDefined();
  });

  test('get post by id', async () => {
    const response = await request(app)
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe('This is a test post');
    expect(response.body.userId).toBe(userId);
    expect(response.body.createdTime).toBeDefined();
  });

  test('update post', async () => {
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        content: 'Updated test content',
        imageUrl: null,
        createdTime: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe('Updated test content');
    expect(response.body.createdTime).toBeDefined();
  });
  
  test('like and unlike post', async () => {
    const response = await request(app)
      .post(`/posts/like/${postId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
  });

  test('delete post', async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
  });


  test('fail to create post without authorization', async () => {
    const response = await request(app).post('/posts').send({
      content: 'This post should not be created',
      imageUrl: null,
      createdTime: new Date().toISOString(),
    });

    expect(response.statusCode).toBe(401);
  });

  test('fail to update non-existent post', async () => {
    const response = await request(app)
      .put(`/posts/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        content: 'Trying to update non-existent post',
        imageUrl: null,
        createdTime: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(404);
  });

  test('fail to delete non-existent post', async () => {
    const response = await request(app)
      .delete(`/posts/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.statusCode).toBe(404);
  });

  test('fail to like and unlike post without authorization', async () => {
    const response = await request(app).post(`/posts/like/${postId}`).send({
      title: 'Unauthorized Post',
      content: 'This post should not be liked or unliked',
    });

    expect(response.statusCode).toBe(401);
  });
});
