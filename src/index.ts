import express, { Application, Request, Response } from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import connectToDB from './db/connection';
import apiV1 from './routes/v1';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT: string = process.env.PORT!;
const app: Application = express();
app.use(
  cors({
    origin: ['https://meedu.app', 'http://localhost:5000','http://127.0.0.1:5500'],
  })
);
app.use(urlencoded({ extended: false }));
app.use(json());

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'views/index.html'))
);
apiV1(app);

app.use((req: Request, res: Response) => {
  res.status(404).send('NOT FOUND');
});

connectToDB().then((connected: boolean) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log('running on ' + PORT);
    });
  } else {
    console.log('Error mongo db');
  }
});
