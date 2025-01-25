import request from 'supertest';
import {Express} from 'express';
import {initializeExpress} from '../server';
import {prepareUserForTests} from './prepareTests';

let app: Express;
let userAccessToken = '';

beforeAll(async () => {
  app = await initializeExpress();
  const user = await prepareUserForTests(app);
  userAccessToken = user.accessToken;
});

describe('FilesController', () => {
  it('should upload a file successfully', async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', Buffer.from('test file content'), 'testfile.txt')
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('url');
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app)
      .post('/files')
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'No file uploaded');
  });

  it('should return 401 if no authorization token is provided', async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', Buffer.from('test file content'), 'testfile.txt');

    expect(response.status).toBe(401);
  });

  it('should return 401 if an invalid authorization token is provided', async () => {
    const response = await request(app)
      .post('/files')
      .attach('file', Buffer.from('test file content'), 'testfile.txt')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(401);
  });
});
