import {initializeExpress} from './server';

const port = process.env.PORT;

initializeExpress().then((app) => {
  app.listen(port, () => {
    console.log(`GymnastLink app listening at http://localhost:${port}`);
  });
});
