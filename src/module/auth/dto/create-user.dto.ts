import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  number: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
