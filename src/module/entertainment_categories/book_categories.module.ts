import { Module } from '@nestjs/common';
import { EntertainmentCategoriesController } from './book_categories.controller';
import { EntertainmentCategoriesService } from './book_categories.service';

@Module({
  controllers: [EntertainmentCategoriesController],
  providers: [EntertainmentCategoriesService],
})
export class EntertainmentCategoriesModule {}
