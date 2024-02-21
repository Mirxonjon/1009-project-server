import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateCommunalDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  // @IsString()
  text: string;

  // @IsObject()
  table_arr: object;

  mention:string;
  
  warning: string;
}
