import { IsString } from 'class-validator';

export class UpdateOrganizationDto {
   // @IsString()
  // // @IsNotEmpty()
  // sub_category_id: string;
  @IsString()
  // @IsNotEmpty()
  sub_category_id: string;

  @IsString()
  main_organization: string;

  @IsString()
  organization_name: string;

  @IsString()
  section: string;

  @IsString()
  manager: string;

  @IsString()
  email: string;

  // @IsString()
  // index: string;

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
  comment: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsIn(['ru', 'uz'])
  // language: string;

  // @IsNotEmpty()
  scheduler: string;

  payment_type: string;

  transport: string;

  location: string;

  pictures: object;

  @IsString()
  phones: string;

  pictures_delete : string
}
