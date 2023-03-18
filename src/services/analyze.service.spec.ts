import { UnsplashClient } from '../clients';
import { AnalyzeRequestModel } from '../models';
import { AnalyzeService } from './analyze.service';

const mockUnsplashClient: jest.Mocked<UnsplashClient> = {
  searchPhotos: jest.fn(),
} as unknown as jest.Mocked<UnsplashClient>;

describe('AnalyzeService', () => {
  let service: AnalyzeService;

  beforeAll(() => {
    service = new AnalyzeService(mockUnsplashClient);
  });

  afterEach(() => {
    mockUnsplashClient.searchPhotos.mockRestore();
  });

  describe('analyze', () => {
    const params: AnalyzeRequestModel = {
      keyword: 'car',
      labels: ['123', 'hello'],
    };

    afterEach(() => {
      mockUnsplashClient.searchPhotos.mockRestore();
      mockUnsplashClient.searchPhotos.mockClear();
    });

    it('Should transfer the search keyword to Unsplash API', async () => {
      mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
        type: 'success',
      } as any);
      await service.analyze(params);
      expect(mockUnsplashClient.searchPhotos).toBeCalledTimes(1);
      expect(mockUnsplashClient.searchPhotos).toBeCalledWith(params.keyword);
    });

    it('Should returns a success response if there is no error from Unsplash API', async () => {
      mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
        type: 'success',
        status: 200,
        response: {
          total: 1,
          results: [
            {
              urls: {
                regular: 'something',
              },
            },
          ],
        },
      } as any);

      const results = await service.analyze(params);
      expect(results).toMatchObject({
        success: true,
        keyword: params.keyword,
        matches: [
          {
            imageUrl: 'something',
            labels: params.labels,
          },
        ],
      });
    });

    it('Should returns an error response if there is error from Unsplash API', async () => {
      mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
        type: 'error',
        status: 500,
        errors: ['Expected error'],
      } as any);

      const results = await service.analyze(params);
      expect(results).toMatchObject({
        success: false,
        status: 500,
        errors: ['Expected error'],
      });
    });
  });
});
