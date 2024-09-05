import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CheckOrganizationStatus } from 'src/types';

export class CheckOrganizationDto {
  @ApiProperty({ required: true, example: 'accept or reject' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(CheckOrganizationStatus, { each: true })
  status: CheckOrganizationStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
