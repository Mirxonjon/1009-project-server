import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateCommunalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  title_ru: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  // @IsString()
  text: string;
  text_ru : string
  
  // @IsObject()
  table_arr: object;
  table_arr_ru: object;
  
  mention: string;
  mention_ru: string;
  
  warning: string;
  warning_ru: string;
  



}