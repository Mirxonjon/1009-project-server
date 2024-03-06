import { IsString, IsNotEmpty, MaxLength, IsObject } from 'class-validator';

export class CreateKnowDataDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  // @IsString()
  text: object;

  // @IsObject()
  table_arr: object;

  mention: string;

  warning: string;
}
