import express, { Express } from 'express';

import { env } from './load-env';
import { addAnalyzeRoutes } from './routes';

const app: Express = express();
const port = env.port;

app.use(express.json());

addAnalyzeRoutes(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
