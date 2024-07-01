import { Module } from '@nestjs/common';
import { SubCategoryOrganizationController } from './subcategoryorganization.controller';
import { SubCategoryOrganizationServise } from './subcategoryorganization.service';

@Module({
  controllers: [SubCategoryOrganizationController],
  providers: [SubCategoryOrganizationServise],
})
export class SubCategoryOrganizationModule {}
