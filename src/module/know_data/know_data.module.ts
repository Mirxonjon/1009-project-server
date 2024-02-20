import { Module } from '@nestjs/common';
import { KnowDataController } from './know_data.controller';
import { KnowDataServise } from './know_data.service';

@Module({
  controllers: [KnowDataController],
  providers: [KnowDataServise],
})
export class KnowDataModule {}
