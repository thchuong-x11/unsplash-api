import express, { Express, Request, Response } from 'express';
import { env } from './load-env';

const app: Express = express();
const port = env.port;

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});