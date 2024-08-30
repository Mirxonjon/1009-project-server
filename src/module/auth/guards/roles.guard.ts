import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './roles.decorator';
import { RolesEnum } from '../../../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    console.log(requiredRoles);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
console.log(token);


    if(!token) {
      throw new ForbiddenException('Token not found');
    }

    
    try {
      const user = this.jwtService.verify(token);

      request.user = {
        userId: user.id,
        role: user.role,
      };

      return requiredRoles.some((role) => user.role?.includes(role));
    } catch (error) {
      console.log(error);

      throw new ForbiddenException(error.message);
    }
  }
}
