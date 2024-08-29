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
} from 'class-validator';

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
  paymentType?: string; // maybe enum


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mainOrganization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  segment?: string;

  /*

    Address
  */
}
