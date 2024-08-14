import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ImportedFilesServise } from './importedFiles.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { UpdateOrganizationDataDto } from './dto/update_importedFiles.dto';

@Controller('importedFiles')
@ApiTags('imported Files')
@ApiBearerAuth('JWT-auth')
export class ImportedFilesController {
  readonly #_service: ImportedFilesServise;
  constructor(service: ImportedFilesServise) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall() {
    return await this.#_service.findAll();
  }

  @Patch('/updateData')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileName: {
          type: 'string',
          default: 'data.xlsx',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async updateDate(
    @Body() updateOrganizationDataDto: UpdateOrganizationDataDto,
  ) {
    await this.#_service.updateData(updateOrganizationDataDto);
  }

  // @Post('excel')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     required: ['file'],
  //     properties: {
  //       fileName: {
  //         type: 'string',
  //       },
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Attendance Punch In' })
  // @ApiCreatedResponse()
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFileExcel(
  //   @Body() body: UpdateOrganizationDataDto,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new FileTypeValidator({
  //           fileType:
  //             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         }),
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.#_service.uploadFileExcel(body, file);
  // }

  @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    await this.#_service.remove(id);
  }
}
