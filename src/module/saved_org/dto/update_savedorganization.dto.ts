import { IsEmpty, IsIn, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateSavedOrganizationDto {
  @IsString()
  organization_id: string;
}
