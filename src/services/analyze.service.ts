import { UnsplashClient } from '../clients';
import { AnalyzeRequestModel, AnalyzeResponseModel } from '../models';

export class AnalyzeService {
  constructor(private readonly unsplashClient: UnsplashClient) {}

  public async analyze(
    params: AnalyzeRequestModel
  ): Promise<AnalyzeResponseModel | never> {
    const { keyword, labels } = params;
    const unsplashPhotosResponse = await this.unsplashClient.searchPhotos(
      keyword
    );

    const { type } = unsplashPhotosResponse;
    if (type === 'error') {
      const { errors, status } = unsplashPhotosResponse;
      return {
        success: false,
        status: status,
        errors: errors,
      };
    }

    const pagedUnsplashPhotos = unsplashPhotosResponse.response;
    if (!pagedUnsplashPhotos || pagedUnsplashPhotos.total === 0) {
      return {
        success: true,
        keyword,
        matches: [],
      };
    }

    const matches = pagedUnsplashPhotos.results.map((photo) => ({
      imageUrl: photo.urls.regular,
      labels,
    }));

    return {
      success: true,
      keyword,
      matches: matches,
    };
  }
}
