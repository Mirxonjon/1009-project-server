import { IsString, MaxLength } from 'class-validator';

export class UpdatePictureDto {
  @IsString()
  organizationId: string;
}
