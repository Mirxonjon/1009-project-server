import { IsNotEmpty, IsNumber, IsString,  } from 'class-validator';

export class UpdateCommentAndRateDto {
  @IsString()
  @IsNotEmpty()
  organization_id: string;

  @IsNumber()
  rate: number

  @IsString()
  comment: string;
}
