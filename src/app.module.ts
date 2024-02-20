import { Module, CacheModuleOptions } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { connectDb } from './config/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { EntertainmentCategoriesModule } from './module/entertainment_categories/book_categories.module';
import { CommunalModule } from './module/entertainment_content/communals.module';
import { AuthModule } from './module/auth/auth.module';
import { EntertainmentsModule } from './module/communal_content/entertainments.module';
import { InformationTashkentModule } from './module/information_tashkent/information_tashkents.module';
import { KnowDataModule } from './module/know_data/know_data.module';
import { NumbersCodesModule } from './module/numbers_code/know_data.module';

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
    EntertainmentCategoriesModule,
    EntertainmentsModule,
    CommunalModule,
    InformationTashkentModule,
    KnowDataModule,
    NumbersCodesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
