import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateSavedOrganizationDto {
  @IsString()
  @IsNotEmpty()
  organization_id: string;
}
