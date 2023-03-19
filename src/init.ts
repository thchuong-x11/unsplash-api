import { GoogleVisionClient, UnsplashClient } from './clients';
import { env } from './load-env';
import { AnalyzeService } from './services';

// NOTE: all these could be avoided if we have the Injectable decorator of NestJS

export const UNSPLASH_CLIENT_INSTANCE = new UnsplashClient(
  env.unsplash.accessKey
);
export const GOOGLE_VISION_CLIENT = new GoogleVisionClient(
  env.googleVision.keyFilePath
);
export const ANALYZE_SERVICE = new AnalyzeService(
  UNSPLASH_CLIENT_INSTANCE,
  GOOGLE_VISION_CLIENT
);
