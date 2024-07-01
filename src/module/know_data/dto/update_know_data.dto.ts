import { IsEmpty, IsIn, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateKnowDataDto {
  @IsString()
  title: string;

  @IsString()
  @IsIn(['ru', 'uz'])
  language: string;

  @IsString()
  type: string;

  text: object;

  table_arr: object;

  mention: string;

  warning: string;
}
