import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateKnowDataDto {

  // @IsString()
  text: string;

  // @IsObject()
  table_arr: object;
}
