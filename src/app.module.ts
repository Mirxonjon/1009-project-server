import { Module, CacheModuleOptions } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { connectDb } from './config/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { EntertainmentCategoriesModule } from './module/entertainment_categories/entertainment_categories.module';
import { AuthModule } from './module/auth/auth.module';
import { InformationTashkentModule } from './module/information_tashkent/information_tashkents.module';
import { KnowDataModule } from './module/know_data/know_data.module';
import { NumbersCodesModule } from './module/numbers_code/numbers_codes.module';
import { CommunalModule } from './module/communal_content/communals.module';
import { EntertainmentsModule } from './module/entertainment_content/entertainments.module';
import { OrganizationModule } from './module/organization/organization.module';
import { ImportedFilesModule } from './module/exported_files/importedFiles.module';
import { OrganizationCategoriesModule } from './module/category_org/organization_categories.module';
import { SubCategoryOrganizationModule } from './module/sub_category_organization/subcategoryorganization.module';
import { SectionModule } from './module/section/section.module';
import { SavedOrganizationModule } from './module/saved_org/savedorganization.module';
import { RolesGuard } from './module/auth/guards/roles.guard';
import { CommentAndRateModule } from './module/comment_and_rate/subcategoryorganization.module';
import { UsersModule } from './module/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (): CacheModuleOptions => ({
        ttl: 3600000,
      }),
    }),
    AuthModule,
    UsersModule,
    OrganizationCategoriesModule,
    SubCategoryOrganizationModule,
    SectionModule,
    OrganizationModule,
    SavedOrganizationModule,
    CommentAndRateModule,
    EntertainmentCategoriesModule,
    EntertainmentsModule,
    CommunalModule,
    InformationTashkentModule,
    KnowDataModule,
    NumbersCodesModule,
    ImportedFilesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
