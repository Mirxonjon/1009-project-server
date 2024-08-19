import { IsString, MaxLength } from 'class-validator';

export class VerifySmsCodeDto {
  @IsString()
  userId: string;
  @IsString()
  smsCode: string;
}
