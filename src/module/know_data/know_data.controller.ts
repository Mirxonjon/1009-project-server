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
        type: {
          type: 'string',
          default: 'text',
        },
        text: {
          type: 'string',
          default: '<html> salom</html>',
        },
        mention: {
          type: 'string',
          default: 'Mention text goes here',
        },
        warning: {
          type: 'string',
          default: 'Warning text goes here',
        },
        table_arr: {
          type: 'object',
          default: {
            header: [{ value: 'ustun' }, { value: 'ustun2' }],
            row: [{ value: 'qator' }, { value: 'qator2' }],
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
        type: {
          type: 'string',
          default: 'text',
        },
        mention: {
          type: 'string',
          default: 'Mention text goes here',
        },
        warning: {
          type: 'string',
          default: 'Warning text goes here',
        },
        text: {
          type: 'string',
          default: '<html> salom</html>',
        },
        table_arr: {
          type: 'object',
          default: {
            header: [{ value: 'ustun' }, { value: 'ustun2' }],
            row: [{ value: 'qator' }, { value: 'qator2' }],
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
