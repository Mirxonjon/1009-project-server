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
import { EntertainmentServise } from './entertainments.service';
import { CreateEntertainmentsDto } from './dto/create_entertainment.dto';
import { UpdateEntertainmentsDto } from './dto/update_entertainment.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('Entertainment')
@ApiTags('Entertainment Content')
@ApiBearerAuth('JWT-auth')
export class EntertainmentsController {
  readonly #_service: EntertainmentServise;
  constructor(service: EntertainmentServise) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Query('language') language: string) {
    return await this.#_service.findAll(language);
  }

  // @Get('withCategory/allWithPage/:id?')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // async findallWithpage(
  //   @Param('id') id: string,
  //   @Query('pageNumber') pageNumber: number,
  //   @Query('pageSize') pageSize: number,
  // ) {
  //   return await this.#_service.findAllwithCategory(id,);
  // }

  //
  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category_id', 'title', 'language', 'type'],
      properties: {
        category_id: {
          type: 'string',
          default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
        },
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
  async create(@Body() createEntertainmentsDto: CreateEntertainmentsDto) {
    return await this.#_service.create(createEntertainmentsDto);
  }

  @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_id: {
          type: 'string',
          default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
        },
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
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateEntertainmentsDto: UpdateEntertainmentsDto
  ) {
    await this.#_service.update(id, updateEntertainmentsDto);
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
