import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { EntertainmentsEntity } from 'src/entities/entertainment.entity';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { KnowDataEntity } from 'src/entities/know_data.entity';
import { CommunalEntity } from 'src/entities/communal.entity';
import { InformationTashkentEntity } from 'src/entities/information_Tashkent.entity';
import { NumbersCodesEntity } from 'src/entities/Numbers_codes.entity';

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
    EntertainmentCategoriesEntity,
    EntertainmentsEntity,
    CommunalEntity,
    InformationTashkentEntity,
    KnowDataEntity,
    NumbersCodesEntity 
  ],
  autoLoadEntities: true,
  synchronize: true,
};
