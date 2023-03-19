import { GoogleVisionClient, UnsplashClient } from '../clients';
import { AnalyzeRequestModel } from '../models';
import { AnalyzeService } from './analyze.service';

const mockUnsplashClient = {
  searchPhotos: jest.fn(),
} as unknown as jest.Mocked<UnsplashClient>;

const mockGoogleVisionClient = {
  detectLabel: jest.fn(),
} as unknown as jest.Mocked<GoogleVisionClient>;

describe('AnalyzeService', () => {
  let service: AnalyzeService;

  beforeAll(() => {
    service = new AnalyzeService(mockUnsplashClient, mockGoogleVisionClient);
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

    describe('Error handling', () => {
      it('Should return an error response if there is error from Unsplash API', async () => {
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

    describe('Functional tests', () => {
      const imageUriToLabels = Object.fromEntries([
        ['something', ['some', 'thing', 'this']],
        ['that', ['this', 'these', 'those']],
        ['nice', ['good']],
      ]);

      it('Should transfer the search keyword to Unsplash API', async () => {
        mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
          type: 'success',
        } as any);
        await service.analyze(params);
        expect(mockUnsplashClient.searchPhotos).toBeCalledTimes(1);
        expect(mockUnsplashClient.searchPhotos).toBeCalledWith(
          expect.objectContaining({ query: params.keyword })
        );
      });

      it('Should return an empty response if there is no results from Unsplash API', async () => {
        mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
          type: 'success',
          status: 200,
          response: {
            total: 0,
            results: [],
          },
        } as any);

        const results = await service.analyze(params);
        expect(results).toMatchObject({
          success: true,
          keyword: params.keyword,
          total: 0,
          matches: [],
        });
      });

      it('Should transfer the photo urls from Unsplash API to Google Vision API', async () => {
        const imageUris = Object.keys(imageUriToLabels);

        mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
          type: 'success',
          status: 200,
          response: {
            total: 1,
            results: imageUris.map((imageUri) => ({
              urls: { regular: imageUri },
            })),
          },
        } as any);

        mockGoogleVisionClient.detectLabel.mockImplementation((imageUri) => {
          return Promise.resolve({
            success: true,
            labels: imageUriToLabels[imageUri],
          });
        });

        await service.analyze(params);
        expect(mockGoogleVisionClient.detectLabel).toHaveBeenCalledTimes(
          imageUris.length
        );

        for (let i = 0; i < imageUris.length; i++) {
          const imageUri = imageUris[i];
          const call = mockGoogleVisionClient.detectLabel.mock.calls[i];
          expect(call).toStrictEqual([imageUri]);
        }
      });

      it('Should only returns the images whose labels match all requested labels', async () => {
        mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
          type: 'success',
          status: 200,
          response: {
            total: 1,
            results: Object.keys(imageUriToLabels).map((imageUri) => ({
              urls: { regular: imageUri },
            })),
          },
        } as any);

        mockGoogleVisionClient.detectLabel.mockImplementation((imageUri) => {
          return Promise.resolve({
            success: true,
            labels: imageUriToLabels[imageUri],
          });
        });

        const res = await service.analyze({ ...params, labels: ['THIS'] });
        expect(res).toMatchObject({
          success: true,
          keyword: params.keyword,
          total: 2,
          matches: [
            {
              imageUrl: 'something',
              labels: imageUriToLabels['something'],
            },
            {
              imageUrl: 'that',
              labels: imageUriToLabels['that'],
            },
          ],
        });
      });

      it('Should return an empty response if there is no image whose labels match all requested labels', async () => {
        mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
          type: 'success',
          status: 200,
          response: {
            total: 1,
            results: Object.keys(imageUriToLabels).map((imageUri) => ({
              urls: { regular: imageUri },
            })),
          },
        } as any);

        mockGoogleVisionClient.detectLabel.mockImplementation((imageUri) => {
          return Promise.resolve({
            success: true,
            labels: imageUriToLabels[imageUri],
          });
        });

        const res = await service.analyze({ ...params, labels: ['NO'] });
        expect(res).toMatchObject({
          success: true,
          keyword: params.keyword,
          total: 0,
          matches: [],
        });
      });

      it('Should return an empty response if all requests to Google Vision fail', async () => {
        mockUnsplashClient.searchPhotos.mockResolvedValueOnce({
          type: 'success',
          status: 200,
          response: {
            total: 1,
            results: Object.keys(imageUriToLabels).map((imageUri) => ({
              urls: { regular: imageUri },
            })),
          },
        } as any);

        mockGoogleVisionClient.detectLabel.mockResolvedValue({
          success: false,
          errors: ['ExpectedError'],
        });

        const res = await service.analyze({ ...params, labels: ['NO'] });
        expect(res).toMatchObject({
          success: true,
          keyword: params.keyword,
          total: 0,
          matches: [],
        });
      });
    });
  });
});
