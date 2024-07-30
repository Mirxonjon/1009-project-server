import { IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  // @IsNotEmpty()
  sub_category_id: string;

  @IsString()
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

  work_time: object;

  payment_type: string;

  transport: string;

  location: string;
  // @IsString()
  pictures: object;
  // @IsObject()
  @IsString()
  phones: string;
}
