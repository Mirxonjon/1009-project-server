import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateCommentAndRateDto {
  @IsString()
  @IsNotEmpty()
  organization_id: string;

  @IsNumber()
  rate: number;

  @IsString()
  comment: string;
}
