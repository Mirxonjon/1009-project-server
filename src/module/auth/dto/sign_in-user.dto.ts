import { IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @IsString()
  @MaxLength(200)
  number: string;

  @IsString()
  @MaxLength(200)
  password: string;
}
