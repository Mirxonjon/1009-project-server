import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CheckOrganizationStatus } from 'src/types';

export class CheckOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(CheckOrganizationStatus, { each: true })
  status: CheckOrganizationStatus;
}
