import { IsEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class UpdateCommunalDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  text: string;

  table_arr: Object;

  mention: string;

  warning: string;
}
