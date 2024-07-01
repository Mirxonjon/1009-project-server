import { IsString, MaxLength } from 'class-validator';

export class UpdateSectionDto {
  @IsString()
  @MaxLength(200)
  title: string;
}
