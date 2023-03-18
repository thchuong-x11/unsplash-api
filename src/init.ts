import { UnsplashClient } from './clients';
import { env } from './load-env';
import { AnalyzeService } from './services';

export const UNSPLASH_CLIENT_INSTANCE = new UnsplashClient(
  env.unsplash.accessKey
);
export const ANALYZE_SERVICE = new AnalyzeService(UNSPLASH_CLIENT_INSTANCE);
