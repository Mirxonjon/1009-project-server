import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateInformationTashkentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ru', 'uz'])
  language: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  // @IsString()
  text: object;

  // @IsObject()
  table_arr: object;

  mention: string;

  warning: string;
}
