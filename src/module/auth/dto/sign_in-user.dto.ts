import { IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @IsString()
  number: string;

  @IsString()
  password: string;
}
