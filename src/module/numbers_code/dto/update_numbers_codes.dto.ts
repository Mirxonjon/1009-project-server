import { IsEmpty, IsIn, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateNumbersCodesDto {
  @IsString()
  title: string;

  @IsString()
  @IsIn(['ru', 'uz'])
  language: string;

  @IsString()
  type: string;

  text: object;

  table_arr: object;

  mention: string;

  warning: string;
}
