import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateEntertainmentsDto {
  category_id: string;

  text: string;

  table_arr: Object;
}
