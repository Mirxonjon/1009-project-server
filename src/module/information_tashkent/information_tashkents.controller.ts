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
import { InformationTashkentServise } from './information_tashkents.service';

import { CreateInformationTashkentDto } from './dto/create_information_tashkent.dto';
import { UpdateInformationTashkentDto } from './dto/update_information_tashkent.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('InformationTashkent')
@ApiTags('Information Tashkent')
@ApiBearerAuth('JWT-auth')
export class InformationTashkentController {
  readonly #_service: InformationTashkentServise;
  constructor(service: InformationTashkentServise) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall() {
    return await this.#_service.findAll();
  }

  // @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
  
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
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(@Body() createInformationTashkentDto: CreateInformationTashkentDto) {
    return await this.#_service.create(createInformationTashkentDto);
  }

  // @UseGuards(jwtGuard)
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
    @Body() updateInformationTashkentDto: UpdateInformationTashkentDto,
  ) {
    await this.#_service.update(id, updateInformationTashkentDto);
  }

  // @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    await this.#_service.remove(id);
  }
}
