import { Module } from '@nestjs/common';
import { SegmentController } from './organization_categories.controller';
import { SegmentService } from './organization_categories.service';

@Module({
  controllers: [SegmentController],
  providers: [SegmentService],
})
export class SegmentModule {}
