import request from 'supertest';
import {Express} from 'express';
import {Types} from 'mongoose';
import {initializeExpress} from '../server';
import {prepareUserForTests} from './prepareTests';

let app: Express;
let userAccessToken = '';
let userId = '';

beforeAll(async () => {
  app = await initializeExpress();
  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
  userId = user._id;
});

describe('UsersController', () => {
  describe('getUserById', () => {
    test('returns user data when user is found', async () => {
      const response = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', userId);
      expect(response.body).toHaveProperty('userName');
      expect(response.body).toHaveProperty('profileImageUrl');
    });

    test('returns 404 when user is not found', async () => {
      const response = await request(app)
        .get(`/users/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe('User not found');
    });

    test('returns 400 on error', async () => {
      const response = await request(app)
        .get('/users/invalid_id')
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe('updateProfileImage', () => {
    test('updates profile image and returns updated user', async () => {
      const response = await request(app)
        .put('/users/profile-picture')
        .send({userId, imageUrl: 'new-url'})
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('profileImageUrl', 'new-url');
    });
  });

  describe('updateUserName', () => {
    test('updates username and returns updated user', async () => {
      const response = await request(app)
        .put('/users/username')
        .send({userId, userName: 'new-username'})
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userName', 'new-username');
    });
  });
});
