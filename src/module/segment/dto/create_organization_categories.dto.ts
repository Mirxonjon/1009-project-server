import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSegmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(200)
  // title_ru: string;

  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(200)
  // title_ru: string;

  // @IsString()
  // @IsNotEmpty()
  // tactic_category: string;
}
