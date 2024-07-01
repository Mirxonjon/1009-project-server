import { IsString, MaxLength } from 'class-validator';

export class UpdateOrganizationCategoryDto {
  @IsString()
  @MaxLength(200)
  title: string;

  // @IsString()
  // @MaxLength(200)
  // title_ru: string;

  // @IsString()
  // tactic_category: string;
}
