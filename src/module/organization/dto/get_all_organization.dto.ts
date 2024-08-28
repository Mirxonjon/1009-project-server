import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number = 10;

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

  /*
  Гол.Организ
  Сигмент
  Address
  */
}
