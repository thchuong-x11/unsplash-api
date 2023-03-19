export interface LabelDetectionSuccessResponse {
  success: true;
  labels: string[];
}

export interface LabelDetectionErrorResponse {
  success: false;
  errors: string[];
}

export type LabelDetectionResponse =
  | LabelDetectionSuccessResponse
  | LabelDetectionErrorResponse;
