import { ImageAnnotatorClient } from '@google-cloud/vision';

import { GoogleVisionClient } from './google-vision-client';

jest.mock('@google-cloud/vision');

const keyFilename = 'hello';

describe('GoogleVisionClient', () => {
  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (ImageAnnotatorClient as any).mockClear();
  });

  it('Should transfer the key file param', () => {
    new GoogleVisionClient(keyFilename);
    expect(ImageAnnotatorClient).toBeCalledTimes(1);
    expect(ImageAnnotatorClient).toBeCalledWith(
      expect.objectContaining({ keyFilename })
    );
  });

  describe('detectLabel', () => {
    const imageUri = 'hello';
    let client: GoogleVisionClient;
    let mockImageAnnotatorClient: jest.Mocked<ImageAnnotatorClient>;
    beforeAll(() => {
      client = new GoogleVisionClient(keyFilename);
      mockImageAnnotatorClient = (ImageAnnotatorClient as any).mock
        .instances[0];
    });

    it('Should return a success response if the request succeeds', async () => {
      mockImageAnnotatorClient.labelDetection.mockResolvedValueOnce([
        {
          labelAnnotations: [{ description: 'hello' }],
        },
      ]);

      const res = await client.detectLabel(imageUri);

      expect(res).toMatchObject({ success: true, labels: ['hello'] });
    });

    it('Should return an error response if the request fails', async () => {
      mockImageAnnotatorClient.labelDetection.mockRejectedValueOnce(
        new Error('Expected error')
      );

      const res = await client.detectLabel(imageUri);

      expect(res).toMatchObject({ success: false, errors: ['Expected error'] });
    });
  });
});
