import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateEntertainmentsDto {
  @IsString()
  @IsNotEmpty()
  category_id: string;

  // @IsString()
  text: string;

  // @IsObject()
  table_arr: object;
}
