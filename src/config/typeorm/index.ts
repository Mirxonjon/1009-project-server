import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { EntertainmentsEntity } from 'src/entities/entertainment.entity';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { KnowDataEntity } from 'src/entities/know_data.entity';
import { CommunalEntity } from 'src/entities/communal.entity';
import { InformationTashkentEntity } from 'src/entities/information_Tashkent.entity';
import { NumbersCodesEntity } from 'src/entities/Numbers_codes.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { SubCategoryOrgEntity } from 'src/entities/sub_category_org.entity';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { PhoneOrganizationEntity } from 'src/entities/phone_organization.entity';
import { CommentAndRateEntity } from 'src/entities/comment_and_rate';
import { PictureOrganizationEntity } from 'src/entities/picture_organization.entity';
import { ImportedFilesTitleEntity } from 'src/entities/imported_files_title.entity';
import { OrganizationVersionsEntity } from 'src/entities/organization_versions.entity';
import { PictureOrganizationVersionsEntity } from 'src/entities/picture_organization_versions.entity';
import { Phone_Organization_Versions_Entity } from 'src/entities/phone_organizations_versions.entity';
import { SectionEntity } from 'src/entities/section.entity';
import { SavedOrganizationEntity } from 'src/entities/saved_org.entity';
import { SegmentEntity } from 'src/entities/segment.entity';

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
    CategoryOrganizationEntity,
    SubCategoryOrgEntity,
    SectionEntity,
    OrganizationEntity,
    SavedOrganizationEntity,
    PhoneOrganizationEntity,
    CommentAndRateEntity,
    PictureOrganizationEntity,
    SegmentEntity,
    ImportedFilesTitleEntity,
    OrganizationVersionsEntity,
    PictureOrganizationVersionsEntity,
    Phone_Organization_Versions_Entity,
  ],
  autoLoadEntities: true,
  synchronize: true,
};
