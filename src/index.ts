import express, { Application, Request, Response } from 'express';
import { urlencoded, json } from 'body-parser';

import apiV1 from './routes/v1';

const PORT = 5000;
const app: Application = express();
app.use(urlencoded({ extended: false }));
app.use(json());

apiV1(app);

app.use((req: Request, res: Response) => {
  res.status(404).send('NOT FOUND');
});

app.listen(PORT, () => {
  console.log('running on ' + PORT);
});
