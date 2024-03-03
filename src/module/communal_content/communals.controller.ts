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
  Query,
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
import { CommunalServise } from './communals.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateCommunalDto } from './dto/create_communal.dto';
import { UpdateCommunalDto } from './dto/update_communal.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('Communal')
@ApiTags('Communal Content')
@ApiBearerAuth('JWT-auth')
export class CommunalController {
  readonly #_service: CommunalServise;
  constructor(service: CommunalServise) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall() {
    return await this.#_service.findAll();
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title' , 'title_ru', 'type'],
      properties: {
        title: {
          type: 'string',
          default: 'title',
        },
        title_ru: {
          type: 'string',
          default: 'title ru',
        },
        type: {
          type: 'string',
          default: 'text',
        },
        text: {
          type: 'string',
          default: '<html> salom</html>',
        },
        text_ru: {
          type: 'string',
          default: '<html> salom</html>',
        },
        mention: {
          type: 'string',
          default: 'Mention text goes here',
        },
        mention_ru: {
          type: 'string',
          default: 'Mention text goes here ru',
        },
        warning: {
          type: 'string',
          default: 'Warning text goes here',
        },
        warning_ru: {
          type: 'string',
          default: 'Warning text goes here ru',
        },
        table_arr: {
          type: 'object',
          default: {
            header: [{ value: 'ustun' }, { value: 'ustun2' }],
            row: [{ value: 'qator' }, { value: 'qator2' }],
          },
        },
        table_arr_ru: {
          type: 'object',
          default: {
            header: [{ value: 'ustun ru' }, { value: 'ustun2 ru' }],
            row: [{ value: 'qator ru' }, { value: 'qator2 ru' }],
          },
        },
      },
    },
  })

  // @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(@Body() createCommunalDto: CreateCommunalDto) {
    return await this.#_service.create(createCommunalDto);
  }

  @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          default: 'title',
        },
        title_ru: {
          type: 'string',
          default: 'title ru',
        },
        type: {
          type: 'string',
          default: 'text',
        },
        text: {
          type: 'string',
          default: '<html> salom</html>',
        },
        text_ru: {
          type: 'string',
          default: '<html> salom</html>',
        },
        mention: {
          type: 'string',
          default: 'Mention text goes here',
        },
        mention_ru: {
          type: 'string',
          default: 'Mention text goes here ru',
        },
        warning: {
          type: 'string',
          default: 'Warning text goes here',
        },
        warning_ru: {
          type: 'string',
          default: 'Warning text goes here ru',
        },
        table_arr: {
          type: 'object',
          default: {
            header: [{ value: 'ustun' }, { value: 'ustun2' }],
            row: [{ value: 'qator' }, { value: 'qator2' }],
          },
        },
        table_arr_ru: {
          type: 'object',
          default: {
            header: [{ value: 'ustun ru' }, { value: 'ustun2 ru' }],
            row: [{ value: 'qator ru' }, { value: 'qator2 ru' }],
          },
        },
      },
    },
  })
  // @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateCommunalDto: UpdateCommunalDto,
  ) {
    await this.#_service.update(id, updateCommunalDto);
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
