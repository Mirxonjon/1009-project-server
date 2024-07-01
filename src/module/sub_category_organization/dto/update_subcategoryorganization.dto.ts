import { IsEmpty, IsIn, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateSubCategoryOrganizationDto {
  category_id: string;

  @IsString()
  title: string;
}
