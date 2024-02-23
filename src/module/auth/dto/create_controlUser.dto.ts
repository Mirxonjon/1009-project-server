import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateControlUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class ControlUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
