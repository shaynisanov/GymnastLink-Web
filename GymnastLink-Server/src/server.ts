import express, {Express} from 'express';
import mongoose from 'mongoose';
import {json, urlencoded} from 'body-parser';
import {postRouter} from './routes/postsRoutes';
import {commentRouter} from './routes/commentsRoutes';
import {userRouter} from './routes/usersRoutes';
import 'dotenv/config';
import {setupSwagger} from './swaggerConfig';

const app = express();

const db = mongoose.connection;
db.once('open', () => console.log('Connected to GymnastLink database'));
db.on('error', (error) => console.error(error));

app.use(json());
app.use(urlencoded({extended: true}));
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/users', userRouter);
 
setupSwagger(app);

const initializeExpress = () =>
  new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject('DB_CONNECT is not defined in .env file');
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });

export {initializeExpress};
