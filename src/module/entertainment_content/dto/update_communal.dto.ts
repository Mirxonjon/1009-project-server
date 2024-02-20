import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateCommunalDto {

  text: string;

  table_arr: Object;

  mention:string;
  
  warning: string;
}
