import { Module } from '@nestjs/common';
import { NumbersCodesController } from './numbers_codes.controller';
import { NumbersCodesServise } from './numbers_codes.service';

@Module({
  controllers: [NumbersCodesController],
  providers: [NumbersCodesServise],
})
export class NumbersCodesModule {}
