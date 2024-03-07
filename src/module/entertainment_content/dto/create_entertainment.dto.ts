import { IsString, IsNotEmpty, MaxLength, IsObject, IsIn } from 'class-validator';

export class CreateEntertainmentsDto {
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ru', 'uz'])
  language: string;


  @IsString()
  @IsNotEmpty()
  type: string;


  text: object;

  table_arr: object;

  mention: string;

  warning: string;



}
