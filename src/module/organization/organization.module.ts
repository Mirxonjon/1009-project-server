import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationServise } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { SubCategoryOrgEntity } from 'src/entities/sub_category_org.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity, SubCategoryOrgEntity]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationServise],
})
export class OrganizationModule {}
