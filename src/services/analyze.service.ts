import { GoogleVisionClient, UnsplashClient } from '../clients';
import {
  AnalyzeRequestModel,
  AnalyzeResponseModel,
  LabelDetectionResponse,
  MatchedPhotoInfo,
} from '../models';
import { isSubset } from '../utils/is-subset';

const UNSPLASH_API_PAGE_SIZE = 30;

export class AnalyzeService {
  constructor(
    private readonly unsplashClient: UnsplashClient,
    private readonly googleVisionClient: GoogleVisionClient
  ) {}

  public async analyze(
    params: AnalyzeRequestModel
  ): Promise<AnalyzeResponseModel> {
    const { keyword, labels } = params;
    const unsplashPhotosResponse = await this.unsplashClient.searchPhotos({
      query: keyword,
      page: 1,
      perPage: UNSPLASH_API_PAGE_SIZE,
    });

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
        total: 0,
        matches: [],
      };
    }

    const urls = pagedUnsplashPhotos.results.map((photo) => photo.urls.regular);
    const labelDetectionResults = await this.batchDetectLabel(urls);
    const labelsSet = new Set(labels.map((label) => label.toLowerCase()));
    const matches: MatchedPhotoInfo[] = [];
    for (const [imageUri, labelDetectionResult] of Object.entries(
      labelDetectionResults
    )) {
      if (labelDetectionResult.success) {
        const { labels } = labelDetectionResult;
        if (
          isSubset(
            labelsSet,
            labels.map((label) => label.toLowerCase())
          )
        ) {
          matches.push({
            imageUrl: imageUri,
            labels,
          });
        }
      } else {
        const { errors } = labelDetectionResult;
        console.debug(
          `Detect label failed with ${imageUri}. Errors: ${errors.join(', ')}`
        );
      }
    }

    return {
      success: true,
      keyword,
      total: matches.length,
      matches,
    };
  }

  private async batchDetectLabel(
    imageUris: string[]
  ): Promise<Record<string, LabelDetectionResponse>> {
    const results = await Promise.all(
      imageUris.map((imageUri) => this.googleVisionClient.detectLabel(imageUri))
    );
    return Object.fromEntries(
      imageUris.map((imageUri, idx) => [imageUri, results[idx]])
    );
  }
}
