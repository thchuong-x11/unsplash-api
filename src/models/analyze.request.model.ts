import { IsString, IsArray, ArrayNotEmpty, Length } from 'class-validator';

export class AnalyzeRequestModel {
  @IsString({
    message: '\'keyword\' must be a non-empty string not longer than 1000 characters'
  })
  @Length(1, 1000, {
    message: '\'keyword\' must be a non-empty string not longer than 1000 characters'
  })
  keyword!: string;

  @IsArray({
    message: '\'labels\' must be a non-empty array containing string'
  })
  @IsString({
    each: true,
    message: '\'labels\' must be a non-empty array containing string'
  })
  @ArrayNotEmpty({
    message: '\'labels\' must be a non-empty array containing string'
  })
  labels!: string[];
}