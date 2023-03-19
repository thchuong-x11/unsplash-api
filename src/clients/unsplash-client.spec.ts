import { afterEach } from 'node:test';
import * as unsplashApi from 'unsplash-js';
import { UnsplashClient } from './unsplash-client';

const mockAccessKey = 'hello world';
const mockUnsplashApi = {
  search: {
    getPhotos: jest.fn(),
  },
};

jest.mock('unsplash-js');

describe('UnsplashClient', () => {
  it('Should use the correct access key', () => {
    const spiedCreateApi = jest.spyOn(unsplashApi, 'createApi');
    new UnsplashClient(mockAccessKey);
    expect(spiedCreateApi).toBeCalledTimes(1);
    expect(spiedCreateApi).toBeCalledWith(
      expect.objectContaining({ accessKey: mockAccessKey })
    );
  });

  describe('searchPhotos', () => {
    const mockQuery = 'car';
    let client: UnsplashClient;
    let spiedCreateApi: jest.SpyInstance<any>;

    beforeAll(() => {
      spiedCreateApi = jest.spyOn(unsplashApi, 'createApi');
      spiedCreateApi.mockReturnValue(mockUnsplashApi as any);
      client = new UnsplashClient(mockAccessKey);
    });

    afterAll(() => {
      spiedCreateApi.mockRestore();
    });

    afterEach(() => {
      mockUnsplashApi.search.getPhotos.mockClear();
    });

    it('Should transfer all the params', async () => {
      await client.searchPhotos({ query: mockQuery, page: 2, perPage: 50 });
      expect(mockUnsplashApi.search.getPhotos).toBeCalledTimes(1);
      expect(mockUnsplashApi.search.getPhotos).toBeCalledWith(
        expect.objectContaining({ query: mockQuery, page: 2, perPage: 50 })
      );
    });
  });
});
