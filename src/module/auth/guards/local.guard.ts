import { AuthGuard } from '@nestjs/passport';

export class localGuard extends AuthGuard('local') {}
