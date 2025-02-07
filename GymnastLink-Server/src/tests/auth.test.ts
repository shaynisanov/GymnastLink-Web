import request from 'supertest';
import {initializeExpress} from '../server';
import mongoose from 'mongoose';
import {Express} from 'express';
import {userModel} from '../models/usersModel';
import {testUserDetails} from './prepareTests';

let app: Express;
let refreshToken = '';
const dupUserEmail = 'duplicateuser@example.com';

beforeAll(async () => {
  app = await initializeExpress();
  await userModel.deleteMany({
    email: [dupUserEmail, testUserDetails.email],
  });
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Users Tests', () => {
  test('register user', async () => {
    const response = await request(app).post('/auth/register').send({
      email: testUserDetails.email,
      password: testUserDetails.password,
    });

    expect(response.statusCode).toBe(200);
  });

  test('login user', async () => {
    const response = await request(app).post('/auth/login').send({
      email: testUserDetails.email,
      password: testUserDetails.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    refreshToken = response.body.refreshToken;
  });

  test('fail to register user with existing email', async () => {
    await request(app).post('/auth/register').send({
      email: dupUserEmail,
      password: 'password123',
    });

    const response = await request(app).post('/auth/register').send({
      email: dupUserEmail,
      password: 'password123',
    });

    expect(response.statusCode).toBe(400);
  });

  test('fail to login with incorrect password', async () => {
    const response = await request(app).post('/auth/login').send({
      email: testUserDetails.email,
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(401);
  });

  test('refresh user token', async () => {
    const response = await request(app).post('/auth/refresh-token').send({
      refreshToken,
    });

    refreshToken = response.body.refreshToken;

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  test('fail to refresh token with invalid refresh token', async () => {
    const response = await request(app).post('/auth/refresh-token').send({
      refreshToken: 'invalidToken',
    });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Invalid refresh token');
  });

  test('logout user', async () => {
    const response = await request(app).post('/auth/logout').send({
      refreshToken,
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('logout successfully');
  });

  test('fail to logout with invalid refresh token', async () => {
    const response = await request(app).post('/auth/logout').send({
      refreshToken: 'invalidToken',
    });

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Invalid refresh token');
  });
});
