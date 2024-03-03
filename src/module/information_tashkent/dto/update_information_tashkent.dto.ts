import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateInformationTashkentDto {
  @IsString()
  title: string;
  
  @IsString()
  title_ru: string;

  @IsString()
  type: string;

  text: string;
  text_ru:string;

  table_arr: object;
  table_arr_ru: object;

  mention: string;
  mention_ru: string;

  warning: string;
  warning_ru: string;




}
