import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

import { SearchPhotosParams } from '../models';

const DEFAULT_PER_PAGE = 10;

export class UnsplashClient {
  private readonly unsplash;

  constructor(unsplashAccessKey: string) {
    this.unsplash = createApi({
      accessKey: unsplashAccessKey,
      fetch: nodeFetch as unknown as typeof fetch,
    });
  }

  public async searchPhotos(params: SearchPhotosParams) {
    const { query, page, perPage } = params;
    return this.unsplash.search.getPhotos({
      query,
      page: page ?? 1,
      perPage: perPage ?? DEFAULT_PER_PAGE,
    });
  }
}
