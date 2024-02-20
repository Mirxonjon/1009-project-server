import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateNumbersCodesDto {

  text: string;

  table_arr: Object;
}
