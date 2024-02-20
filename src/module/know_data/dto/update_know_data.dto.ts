import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateKnowDataDto {

  text: string;

  table_arr: Object;
  
  mention:string;
  
  warning: string;
}
