import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateOrganizationDto {
  // @IsString()
  // // @IsNotEmpty()
  // sub_category_id: string;
  // @IsString()
  // @IsNotEmpty()
  sub_category_id: string;

  // @IsString()
  main_organization: string;

  @IsString()
  @IsNotEmpty()
  organization_name: string;

  @IsString()
  section: string;

  // @IsString()
  manager: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  // @IsString()
  // index: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  // @IsString()
  segment: string;

  // @IsString()
  account: string;

  // @IsString()
  added_by: string;

  // @IsString()
  inn: string;

  // @IsString()
  bank_account: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsIn(['ru', 'uz'])
  // language: string;

  // @IsNotEmpty()
  scheduler: object;

  payment_types: object;

  transport: object;

  location: object;

  pictures: object;

  // @IsString()
  @IsNotEmpty()
  phones: object;
}
