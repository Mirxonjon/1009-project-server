import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateKnowDataDto {

  @IsString()
  title: string;

  text: string;

  table_arr: Object;
  
  mention:string;
  
  warning: string;
}
