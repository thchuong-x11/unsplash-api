import { app } from './app';
import { env } from './load-env';

const port = env.port;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
