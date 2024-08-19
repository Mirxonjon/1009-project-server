export interface CustomRequest extends Request {
  user: UserType;
}
export interface UserType {
  userId: string;
  role: string;
}

export interface CustomHeaders extends Headers {
  authorization: string;
}

export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'moderator',
}

export enum PhoneActionEnum {
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export interface PhoneAction {
  id?: string; // Поле id будет опциональным, так как оно может быть отсутствовать при создании
  action: PhoneActionEnum;
  number: string;
  type_number: string;
}

export type TNumbers = {
  numbers: PhoneAction[];
};

export enum OrganizationStatus {
  Check = '0',
  Accepted = '1',
  Rejected = '2',
}

export type OrganizationStatusType =
  | OrganizationStatus.Check
  | OrganizationStatus.Accepted
  | OrganizationStatus.Rejected;

export enum CheckOrganizationStatus {
  Accept = 'accept',
  Reject = 'reject',
}

export type checkOrganizationType =
  | CheckOrganizationStatus.Accept
  | CheckOrganizationStatus.Reject;
