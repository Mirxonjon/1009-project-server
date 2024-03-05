import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KnowDataServise } from './know_data.service';

import { CreateKnowDataDto } from './dto/create_know_data.dto';
import { UpdateKnowDataDto } from './dto/update_know_data.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('KnowData')
@ApiTags('Know Data')
@ApiBearerAuth('JWT-auth')
export class KnowDataController {
  readonly #_service: KnowDataServise;
  constructor(service: KnowDataServise) {
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
      required: ['title', 'type'],
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
          type: 'object',
          default:  {
            text: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
            text1: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
          },
        },
        text_ru: {
          type: 'object',
          default:  {
            text: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
            text1: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
          },
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
  async create(@Body() createKnowDataDto: CreateKnowDataDto) {
    return await this.#_service.create(createKnowDataDto);
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
        text: {
          type: 'object',
          default:  {
            text: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
            text1: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
          },
        },
        text_ru: {
          type: 'object',
          default:  {
            text: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
            text1: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
          },
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
    @Body() updateKnowDataDto: UpdateKnowDataDto,
  ) {
    await this.#_service.update(id, updateKnowDataDto);
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
