export interface CustomRequest extends Request {
  userId: string;
  role: string;
}

export interface CustomHeaders extends Headers {
  authorization: string;
}

export enum RolesEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'moderator',
}
