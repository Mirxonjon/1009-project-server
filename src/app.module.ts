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
    NumbersCodesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
