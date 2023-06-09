export interface MatchedPhotoInfo {
  imageUrl: string;
  labels: string[];
}

export interface AnalyzeSuccessResponseModel {
  success: true;
  keyword: string;
  total: number;
  matches: Array<MatchedPhotoInfo>;
}

export interface AnalyzeErrorResponseModel {
  success: false;
  status: number;
  errors: string[];
}

export type AnalyzeResponseModel =
  | AnalyzeSuccessResponseModel
  | AnalyzeErrorResponseModel;
