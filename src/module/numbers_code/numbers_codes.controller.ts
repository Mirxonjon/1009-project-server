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
  Query,
  UseGuards,
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
import { NumbersCodesServise } from './numbers_codes.service';

import { CreateNumbersCodesDto } from './dto/create_numbers_codes.dto';
import { UpdateNumbersCodesDto } from './dto/update_numbers_codes.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('NumbersCodes')
@ApiTags('Numbers Codes')
@ApiBearerAuth('JWT-auth')
export class NumbersCodesController {
  readonly #_service: NumbersCodesServise;
  constructor(service: NumbersCodesServise) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Query('language') language: string) {
    return await this.#_service.findAll(language);
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'type', 'language'],
      properties: {
        title: {
          type: 'string',
          default: 'title',
        },
        language: {
          type: 'string',
          default: 'ru',
        },
        type: {
          type: 'string',
          default: 'text',
        },
        text: {
          type: 'object',
          default: {
            text: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
            text1: [{ value: '<html> 1</html>' }, { value: '<html> 1</html>' }],
          },
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
  async create(@Body() createNumbersCodesDto: CreateNumbersCodesDto) {
    return await this.#_service.create(createNumbersCodesDto);
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
        language: {
          type: 'string',
          default: 'ru',
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
          type: 'object',
          default: {
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
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateNumbersCodesDto: UpdateNumbersCodesDto
  ) {
    await this.#_service.update(id, updateNumbersCodesDto);
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
