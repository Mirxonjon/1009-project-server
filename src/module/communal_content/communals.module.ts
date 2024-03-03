import { Module } from '@nestjs/common';
import { CommunalController } from './communals.controller';
import { CommunalServise } from './communals.service';

@Module({
  controllers: [CommunalController],
  providers: [CommunalServise],
})
export class CommunalModule {}
