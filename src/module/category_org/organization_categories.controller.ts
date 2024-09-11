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
import { OrganizationCategoriesService } from './organization_categories.service';
import { CreateOrganizationCategoryDto } from './dto/create_organization_categories.dto';
import { UpdateOrganizationCategoryDto } from './dto/update_organization_categories.dto';
import { RequiredRoles } from '../auth/guards/roles.decorator';
import { RolesEnum } from 'src/types';
import { GetAllCategoriesDto } from './dto/get_all_categories.dto';

// @ApiTags('role')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(RolesGuard)
// @Controller('api/role')
@Controller('OrganizationCategories')
@ApiTags('Organization categories')
@ApiBearerAuth('JWT-auth')
export class OrganizationCategoriesController {
  readonly #_service: OrganizationCategoriesService;
  constructor(service: OrganizationCategoriesService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Query() query: GetAllCategoriesDto) {
    return await this.#_service.findAll(query);
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
  }

  // @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: {
          type: 'string',
          default: 'Apteka',
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Body() createOrganizationCategoryDto: CreateOrganizationCategoryDto
  ) {
    return await this.#_service.create(createOrganizationCategoryDto);
  }

  // @UseGuards(jwtGuard)
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
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationCategoryDto: UpdateOrganizationCategoryDto
  ) {
    return await this.#_service.update(id, updateOrganizationCategoryDto);
  }

  // @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.#_service.remove(id);
  }
}
