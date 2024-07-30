import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PictureServise } from './header_image.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CreatePictureDto } from './dto/create_picture.dto';
import { UpdatePictureDto } from './dto/update_history.dto';
@Controller('picture')
@ApiTags('Picture')
@ApiBearerAuth('JWT-auth')
export class PictureController {
  readonly #_service: PictureServise;
  constructor(service: PictureServise) {
    this.#_service = service;
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string ) {
    
    return await this.#_service.findOne(id);
  }

  

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findAll() {
    return await this.#_service.findAll();
  }


  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'header_image' , 'header_image_mobile'
      ],
      properties: {
        organizationId: {
          type: 'string',
          format: 'binary',
        },
        header_image: {
          type: 'string',
          format: 'binary',
        },

      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'header_image' }]),
  )
  async create(
    @Body() createPicture: CreatePictureDto ,
    @UploadedFiles()
    files: { header_image?: Express.Multer.File;}
  ) {
    
    
    return await this.#_service.create(
      files.header_image[0],
      createPicture
      
    );
  }

  @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
  
        organizationId: {
          type: 'string',
          format: 'binary',
        },
        header_image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'header_image' } ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePictureDto : UpdatePictureDto,
    @UploadedFiles()
    file: { header_image?: Express.Multer.File; },
  ) {
    await this.#_service.update(
      id,
      file?.header_image ? file?.header_image[0] : null,
      updatePictureDto
    );
  }

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
