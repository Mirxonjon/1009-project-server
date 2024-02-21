import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateEntertainmentsDto {
  @IsString()
  @IsNotEmpty()
  category_id: string;

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
