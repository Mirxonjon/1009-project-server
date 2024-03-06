import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateNumbersCodesDto {
  @IsString()
  title: string;
  

  @IsString()
  language: string;

  @IsString()
  type: string;

  text: object;

  table_arr: object;

  mention: string;
  
  warning: string;
}
