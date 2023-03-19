import { ImageAnnotatorClient } from '@google-cloud/vision';

import { LabelDetectionResponse } from '../models';

export class GoogleVisionClient {
  private readonly imageAnnotatorClient;

  constructor(keyFilename: string) {
    this.imageAnnotatorClient = new ImageAnnotatorClient({
      keyFilename,
    });
  }

  /** Could have been done with asyncBatchAnnotateImages but it needs to have access to a gs bucket */
  public async detectLabel(imageUri: string): Promise<LabelDetectionResponse> {
    const request = {
      image: {
        source: {
          imageUri,
        },
      },
    };
    try {
      const [result] = await this.imageAnnotatorClient.labelDetection(request);
      const labels = result.labelAnnotations;
      return {
        success: true,
        labels: (labels ?? [])
          .map((label) => label.description)
          .filter((label) => !!label) as string[],
      };
    } catch (err) {
      return {
        success: false,
        errors: [(err as any).message],
      };
    }
  }
}
