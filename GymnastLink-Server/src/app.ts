import {initializeExpress} from './server';
import https from 'https';
import fs from 'fs';

const port = process.env.PORT;

initializeExpress().then((app) => {
  if (process.env.NODE_ENV != 'production') {
    app.listen(port, () => {
      console.log(`GymnastLink app listening at http://localhost:${port}`);
    });
  } else {
    const options = {
      key: fs.readFileSync('../../client-key.pem'),
      cert: fs.readFileSync('../../client-cert.pem'),
    };
    https.createServer(options, app).listen(port);
  }
});
