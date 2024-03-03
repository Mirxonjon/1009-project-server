import { Module } from '@nestjs/common';
import { EntertainmentsController } from './entertainments.controller';
import { EntertainmentServise } from './entertainments.service';

@Module({
  controllers: [EntertainmentsController],
  providers: [EntertainmentServise],
})
export class EntertainmentsModule {}
