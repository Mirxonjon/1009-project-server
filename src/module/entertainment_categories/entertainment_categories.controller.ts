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
import { EntertainmentCategoriesService } from './entertainment_categories.service';
import { CreateEntertainmentCategoryDto } from './dto/create_entertainment_categories.dto';
import { UpdateEntertainmentCategory } from './dto/update_entertainment_categories.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';

@Controller('EntertainmentCategories')
@ApiTags('Entertainment categories')
@ApiBearerAuth('JWT-auth')
export class EntertainmentCategoriesController {
  readonly #_service: EntertainmentCategoriesService;
  constructor(service: EntertainmentCategoriesService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getall() {
    return await this.#_service.getall();
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string, @Query('language') language: string) {
    return await this.#_service.findOne(id, language);
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'title_ru'],
      properties: {
        title: {
          type: 'string',
          default: 'Teatr',
        },
        title_ru: {
          type: 'string',
          default: 'Teatr',
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Body() createEntertainmentCategoryDto: CreateEntertainmentCategoryDto
  ) {
    return await this.#_service.create(createEntertainmentCategoryDto);
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
          default: 'Teatr',
        },
        title_ru: {
          type: 'string',
          default: 'Teatr',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateEntertainmentCategory: UpdateEntertainmentCategory
  ) {
    return await this.#_service.update(id, updateEntertainmentCategory);
  }

  @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.#_service.remove(id);
  }
}
