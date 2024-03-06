import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateEntertainmentsDto {
  category_id: string;

  @IsString()
  title: string;

  @IsString()
  type: string;


  
  @IsString()
  language: string;

  text: object;

  table_arr: object;


  mention: string;


  warning: string;




}
