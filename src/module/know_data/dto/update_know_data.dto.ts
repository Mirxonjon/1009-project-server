import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateKnowDataDto {
  @IsString()
  title: string;
  
  @IsString()
  title_ru: string;

  @IsString()
  type: string;

  text: object;
  text_ru: object;

  table_arr: object;
  table_arr_ru: object;

  mention: string;
  mention_ru: string;
  
  warning: string;
  warning_ru: string;

}
