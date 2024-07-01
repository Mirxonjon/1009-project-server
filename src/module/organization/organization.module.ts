import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationServise } from './organization.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationServise],
})
export class OrganizationModule {}
