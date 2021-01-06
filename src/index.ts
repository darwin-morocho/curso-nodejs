import express, { Application, Request, Response } from 'express';
import { urlencoded, json } from 'body-parser';
import dotenv from 'dotenv';

import connectToDB from './db/connection';
import apiV1 from './routes/v1';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PORT: string = process.env.PORT!;
const app: Application = express();
app.use(urlencoded({ extended: false }));
app.use(json());

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
