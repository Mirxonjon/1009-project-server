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
  oraganization_id: string;
}
