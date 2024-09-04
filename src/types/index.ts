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

export enum OrganizationVersionActionsEnum {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  DONE = 'done',
}
export enum ActionEnum {
  done = 'done',
  create = 'create',
  update = 'update',
  delete = 'delete',
}

// export enum PhoneActionEnum {
//   create = 'create',
//   update = 'update',
//   delete = 'delete',
// }

export interface PhoneAction {
  id?: string; // Поле id будет опциональным, так как оно может быть отсутствовать при создании
  action: ActionEnum;
  number: string;
  type_number: string;
}

export type TNumbers = {
  numbers: PhoneAction[];
};

export enum OrganizationStatus {
  Deleted = '-1',
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

export enum GetTopTenOrganizatrionStatus {
  True = '1',
  False = '0'
}