import { IsString, MaxLength } from 'class-validator';

export class UpdateSegmentDto {
  @IsString()
  title: string;

  // @IsString()
  // @MaxLength(200)
  // title_ru: string;

  // @IsString()
  // tactic_category: string;
}
