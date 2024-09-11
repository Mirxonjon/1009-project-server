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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubCategoryOrganizationServise } from './subcategoryorganization.service';
import { CreateSubCategoryOrganizationDto } from './dto/create_subcategoryorganization.dto';
import { UpdateSubCategoryOrganizationDto } from './dto/update_subcategoryorganization.dto';
import { GetAllSubCategoriesDto } from './dto/get_all_sub_categories.dto';

@Controller('SubCategoryOrganization')
@ApiTags('Sub Category Organization')
@ApiBearerAuth('JWT-auth')
export class SubCategoryOrganizationController {
  readonly #_service: SubCategoryOrganizationServise;
  constructor(service: SubCategoryOrganizationServise) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Query() query: GetAllSubCategoriesDto) {
    return await this.#_service.findAll(query);
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findallWithpage(@Param('id') id: string) {
    return await this.#_service.findOne(id);
  }

  //
  // @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category_id', 'title'],
      properties: {
        category_id: {
          type: 'string',
          default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
        },
        title: {
          type: 'string',
          default: 'title',
        },
      },
    },
  })

  // @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Body() createSubCategoryOrganizationDto: CreateSubCategoryOrganizationDto
  ) {
    return await this.#_service.create(createSubCategoryOrganizationDto);
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
        title: {
          type: 'string',
          default: 'title',
        },
      },
    },
  })
  // @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateSubCategoryOrganizationDto: UpdateSubCategoryOrganizationDto
  ) {
    await this.#_service.update(id, updateSubCategoryOrganizationDto);
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
