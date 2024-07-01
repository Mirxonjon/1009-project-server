import { Module } from '@nestjs/common';
import { SavedOrganizationController } from './savedorganization.controller';
import { SavedOrganizationServise } from './savedorganization.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [SavedOrganizationController],
  providers: [SavedOrganizationServise, AuthServise],
})
export class SavedOrganizationModule {}
