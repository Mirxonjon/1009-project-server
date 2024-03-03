import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateInformationTashkentDto {
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
  text: string;
  text_ru:string

  // @IsObject()
  table_arr: object;
  table_arr_ru: object;

  mention: string;
  mention_ru: string;

  warning: string;
  warning_ru: string;

}
