import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePictureDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
