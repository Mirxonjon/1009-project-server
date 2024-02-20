import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateNumbersCodesDto {

  // @IsString()
  text: string;

  // @IsObject()
  table_arr: object;

  mention:string;
  
  warning: string;
}
