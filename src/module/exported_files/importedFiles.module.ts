import { Module } from '@nestjs/common';
import { ImportedFilesController } from './importedFiles.controller';
import { ImportedFilesServise } from './importedFiles.service';

@Module({
  controllers: [ImportedFilesController],
  providers: [ImportedFilesServise],
})
export class ImportedFilesModule {}
