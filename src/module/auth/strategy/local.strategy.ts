import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  validate(req: Request): string {
    // const user = d.find(e => e.username == username && e.password == password)

    // if(user) {
    //     throw new UnauthorizedException('User found')
    // }

    return 'ok';
  }
}
