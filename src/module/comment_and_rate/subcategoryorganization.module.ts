import { Module } from '@nestjs/common';
import { CommentAndRateController } from './CommentAndRate.controller';
import { CommentAndRateServise } from './subcategoryorganization.service';

@Module({
  controllers: [CommentAndRateController],
  providers: [CommentAndRateServise],
})
export class CommentAndRateModule {}
