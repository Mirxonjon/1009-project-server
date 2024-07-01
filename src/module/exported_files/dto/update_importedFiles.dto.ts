import { IsEmpty, IsIn, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateOrganizationDataDto {
  @IsString()
  fileName: string;
}
