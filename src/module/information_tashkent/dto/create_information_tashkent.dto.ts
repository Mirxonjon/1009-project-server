import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateInformationTashkentDto {

  // @IsString()
  text: string;

  // @IsObject()
  table_arr: object;
}
