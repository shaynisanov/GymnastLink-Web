import request from 'supertest';
import {initializeExpress} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {userModel} from '../models/usersModel';

let app: Express;
let refreshToken = '';

beforeAll(async () => {
  app = await initializeExpress();
  await userModel.deleteMany();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Users Tests', () => {
  test('register user', async () => {
    const response = await request(app).post('/users/register').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('testuser@example.com');
  });

  test('login user', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    refreshToken = response.body.refreshToken;
  });

  test('fail to register user with existing email', async () => {
    await request(app).post('/users/register').send({
      email: 'duplicateuser@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/users/register').send({
      email: 'duplicateuser@example.com',
      password: 'password123',
    });

    expect(response.statusCode).toBe(400);
  });

  test('fail to login with incorrect password', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'testuser@example.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
  });

  test('refresh user token', async () => {
    const response = await request(app).post('/users/refresh-token').send({
      refreshToken,
    });

    refreshToken = response.body.refreshToken;

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  test('fail to refresh token with invalid refresh token', async () => {
    const response = await request(app).post('/users/refresh-token').send({
      refreshToken: 'invalidToken',
    });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Invalid refresh token');
  });

  test('logout user', async () => {
    const response = await request(app).post('/users/logout').send({
      refreshToken,
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('logout successfully');
  });

  test('fail to logout with invalid refresh token', async () => {
    const response = await request(app).post('/users/logout').send({
      refreshToken: 'invalidToken',
    });

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Invalid refresh token');
  });
});
