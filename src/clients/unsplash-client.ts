import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

const DEFAULT_PER_PAGE = 10;

export class UnsplashClient {
  private readonly unsplash;

  constructor(unsplashAccessKey: string) {
    this.unsplash = createApi({
      accessKey: unsplashAccessKey,
      fetch: nodeFetch as unknown as typeof fetch,
    });
  }

  public async searchPhotos(
    query: string,
    page = 1,
    perPage = DEFAULT_PER_PAGE
  ) {
    return this.unsplash.search.getPhotos({ query, page, perPage });
  }
}
