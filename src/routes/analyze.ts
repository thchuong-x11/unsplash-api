import { validate } from 'class-validator';
import { Express, Request, Response } from 'express';

import { ANALYZE_SERVICE } from '../init';
import { AnalyzeRequestModel } from '../models';
import { omit } from '../utils';

export const addAnalyzeRoutes = (app: Express) => {
  app.post('/analyze', async (req: Request, res: Response) => {
    const body = req.body;
    if (!body) {
      res.status(400).json({
        errors: ['Expecting a body'],
      });
      return;
    }

    const analyzeRequest = new AnalyzeRequestModel();
    analyzeRequest.labels = body.labels;
    analyzeRequest.keyword = body.keyword;

    const errors = await validate(analyzeRequest);
    if (errors.length) {
      const errorsToDisplay = new Set(
        errors.flatMap((err) => Object.values(err.constraints ?? {}))
      );
      res.status(400).json({
        errors: Array.from(errorsToDisplay.values()),
      });

      return;
    }

    try {
      const results = await ANALYZE_SERVICE.analyze(analyzeRequest);

      if (results.success) {
        res.status(200).json(results);
      } else {
        res.status(results.status).json(omit(results, 'status'));
      }
    } catch (err) {
      res.status(500).json({
        errors: [err],
      });
    }
  });
};
