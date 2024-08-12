import { IsString, MaxLength } from 'class-validator';

export class UpdateUserDto  {
  @IsString()
  full_name: string;

  @IsString()
  number: string;

  @IsString()
  role: string;

  @IsString()
  password: string;

}
