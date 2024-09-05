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

export class GetAllSegmentDto {
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
  searchName?: string = 'null';


  @ApiProperty({ required: false ,example:'true'})
  @IsOptional()
  @IsString()
  allSegment?: string;

  /*

    Address
  */
}
