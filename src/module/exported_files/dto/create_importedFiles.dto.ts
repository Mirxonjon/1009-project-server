import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateCommunalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ru', 'uz'])
  language: string;
  // @IsString()
  text: object;
  // @IsObject()
  table_arr: object;

  mention: string;

  warning: string;
}
