import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateEntertainmentsDto {
  category_id: string;

  @IsString()
  title: string;

  @IsString()
  type: string;

  text: string;

  table_arr: Object;
  mention: string;

  warning: string;
}
