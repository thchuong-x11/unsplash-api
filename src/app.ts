import { validate } from 'class-validator';
import express, { Express, Request, Response } from 'express';
import { env } from './load-env';
import { AnalyzeRequestModel } from './models';

const app: Express = express();
const port = env.port;

app.use(express.json());

app.post('/analyze', async (req: Request, res: Response) => {

  const body = req.body;
  if (!body) {
    res.status(400).json({
      errors: ['Expecting a body']
    });
    return;
  }

  // data from the token that is verified
  const analyzeRequestModel = new AnalyzeRequestModel();
  analyzeRequestModel.labels = body.labels;
  analyzeRequestModel.keyword = body.keyword;

  // verify input parameters
  const errors = await validate(analyzeRequestModel);
  if (errors.length) {
    const errorsToDisplay = new Set(errors.flatMap(err => Object.values(err.constraints ?? {})));
    res.status(400).json({
      errors: Array.from(errorsToDisplay.values())
    });

    return;
  }

  res.status(200).json({
    searchBody: analyzeRequestModel
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});