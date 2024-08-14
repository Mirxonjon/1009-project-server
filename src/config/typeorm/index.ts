import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { EntertainmentsEntity } from 'src/entities/entertainment.entity';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { KnowDataEntity } from 'src/entities/know_data.entity';
import { CommunalEntity } from 'src/entities/communal.entity';
import { InformationTashkentEntity } from 'src/entities/information_Tashkent.entity';
import { NumbersCodesEntity } from 'src/entities/Numbers_codes.entity';
import { Category_Organization_Entity } from 'src/entities/category_org.entity';
import { Sub_Category_Org_Entity } from 'src/entities/sub_category_org.entity';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { Phone_Organization_Entity } from 'src/entities/phone_organization.entity';
import { CommentAndRateEntity } from 'src/entities/commentAndRate.entity';
import { Picture_Organization_Entity } from 'src/entities/picture_organization.entity';
import { ImportedFilesTitleEntity } from 'src/entities/imported_files_title.entity';
import { Section_Entity } from 'src/entities/section.entity';
import { Saved_Organization_Entity } from 'src/entities/saved_org.entity';
import { OrganizationVersionsEntity } from 'src/entities/organization_versions.entity';
import { Picture_Organization_Versions_Entity } from 'src/entities/picture_organization_versions.entity';
import { Phone_Organization_Versions_Entity } from 'src/entities/phone_organizations_versions.entity';

dotenv.config();

export const connectDb: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  password: String(process.env.DB_PASSWORD),
  username: process.env.DB_USERNAME,
  database: process.env.DATABASE,
  entities: [
    UsersEntity,
    // ControlUsersEntity,
    EntertainmentCategoriesEntity,
    EntertainmentsEntity,
    CommunalEntity,
    InformationTashkentEntity,
    KnowDataEntity,
    NumbersCodesEntity,
    Category_Organization_Entity,
    Sub_Category_Org_Entity,
    Section_Entity,
    OrganizationEntity,
    Saved_Organization_Entity,
    Phone_Organization_Entity,
    CommentAndRateEntity,
    Picture_Organization_Entity,
    ImportedFilesTitleEntity,
    OrganizationVersionsEntity,
    Picture_Organization_Versions_Entity,
    Phone_Organization_Versions_Entity
  ],
  autoLoadEntities: true,
  synchronize: true,
};
