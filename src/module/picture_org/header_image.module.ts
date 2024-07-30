import { Module } from '@nestjs/common';
import { PictureController } from './header_image.controller';
import { PictureServise } from './header_image.service';

@Module({
  controllers: [PictureController],
  providers: [PictureServise],
})
export class PictureModule {}
