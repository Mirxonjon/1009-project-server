import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateNumbersCodesDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @IsString()
  @IsNotEmpty()
  title_ru: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  // @IsString()
  text: object;
  text_ru:object;

  // @IsObject()
  table_arr: object;
  table_arr_ru: object;

  mention: string;
  mention_ru: string;

  warning: string;
  warning_ru: string;




}
