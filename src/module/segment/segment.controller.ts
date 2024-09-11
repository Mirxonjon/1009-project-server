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
import { SegmentService } from './segment.service';
import { CreateSegmentDto } from './dto/create_segment.dto';
import { UpdateSegmentDto } from './dto/update_segment.dto';
import { RequiredRoles } from '../auth/guards/roles.decorator';
import { RolesEnum } from 'src/types';
import { GetAllSegmentDto } from './dto/get_all_segment.dto';

// @ApiTags('role')
// @UseGuards(RolesGuard)
// @Controller('api/role')
// @ApiBearerAuth('JWT-auth')
@Controller('segment')
@ApiTags('Segment')
@ApiBearerAuth('JWT-auth')
export class SegmentController {
  readonly #_service: SegmentService;
  constructor(service: SegmentService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Query() query: GetAllSegmentDto) {
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
          default: 'B2B',
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Body() createOrganizationCategoryDto: CreateSegmentDto
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
          default: 'B2C',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationCategoryDto: UpdateSegmentDto
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
