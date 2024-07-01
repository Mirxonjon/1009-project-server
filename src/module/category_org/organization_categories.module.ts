import { Module } from '@nestjs/common';
import { OrganizationCategoriesController } from './organization_categories.controller';
import { OrganizationCategoriesService } from './organization_categories.service';

@Module({
  controllers: [OrganizationCategoriesController],
  providers: [OrganizationCategoriesService],
})
export class OrganizationCategoriesModule {}
