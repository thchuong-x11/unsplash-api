import express, { Express } from 'express';

import { env } from './load-env';
import { addAnalyzeRoutes } from './routes';

export const app: Express = express();
const port = env.port;

app.use(express.json());

addAnalyzeRoutes(app);
