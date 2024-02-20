import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateCommunalDto {

  // @IsString()
  text: string;

  // @IsObject()
  table_arr: object;
}
