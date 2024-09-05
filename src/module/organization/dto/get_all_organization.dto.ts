import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsIn,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { GetTopTenOrganizatrionStatus } from 'src/types';

export class GetAllOrganizationsDto {
  @ApiProperty({ required: false, example: 1, })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, example: 10, })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subCategory?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  section?: string; // maybe enum


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mainOrganization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  segment?: string;

  @ApiProperty({ required: false, default: GetTopTenOrganizatrionStatus.False, description: 'Enum: [1, 0]', })
  @IsOptional()
  @IsString()
  @IsEnum(GetTopTenOrganizatrionStatus, { each: true })
  isTopTenList?: GetTopTenOrganizatrionStatus;

  /*

    Address
  */
}
