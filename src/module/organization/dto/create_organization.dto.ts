import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateOrganizationDto {

  @IsString()
  // @IsNotEmpty()
  sub_category_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  section: string;

  @IsString()
  head_organization: string;

  @IsString()
  manager: string;

  @IsString()
  e_mail: string;

  @IsString()
  index: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  segment: string;

  @IsString()
  account: string;

  @IsString()
  added_by: string;

  @IsString()
  inn: string;

  @IsString()
  bank_account: string;

  @IsString()
  more_info: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsIn(['ru', 'uz'])
  // language: string;

  work_time: object;

  payment_type: string;

  transport: string;

  location: string;
  // @IsString()
  pictures: object;
  @IsString()
  phones: string;
}
