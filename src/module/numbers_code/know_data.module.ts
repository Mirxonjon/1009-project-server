import { Module } from '@nestjs/common';
import { NumbersCodesController } from './know_data.controller';
import { NumbersCodesServise } from './know_data.service';

@Module({
  controllers: [NumbersCodesController],
  providers: [NumbersCodesServise],
})
export class NumbersCodesModule {}
