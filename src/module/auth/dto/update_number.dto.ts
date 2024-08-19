import { IsString, MaxLength } from 'class-validator';

export class UpdateNumberDto {

  @IsString()
  number: string;
}

export class UpdateNumberVerifySmsCodeDto {    
  @IsString()
  smsCode: string;

  @IsString()
  number: string;
}
