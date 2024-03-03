import { Module } from '@nestjs/common';
import { EntertainmentCategoriesController } from './entertainment_categories.controller';
import { EntertainmentCategoriesService } from './entertainment_categories.service';

@Module({
  controllers: [EntertainmentCategoriesController],
  providers: [EntertainmentCategoriesService],
})
export class EntertainmentCategoriesModule {}
