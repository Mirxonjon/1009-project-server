import { Module } from '@nestjs/common';
import { InformationTashkentController } from './information_tashkents.controller';
import { InformationTashkentServise } from './information_tashkents.service';

@Module({
  controllers: [InformationTashkentController],
  providers: [InformationTashkentServise],
})
export class InformationTashkentModule {}
