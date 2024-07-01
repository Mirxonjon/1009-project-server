import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;
}
