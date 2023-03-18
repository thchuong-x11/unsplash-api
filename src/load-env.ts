import { readFileSync } from 'fs';

import { Env } from './models';

const loadEnv = (): Env => {
  const rawData = readFileSync('conf.json');
  return JSON.parse(rawData.toString());
};

export const env = loadEnv();
