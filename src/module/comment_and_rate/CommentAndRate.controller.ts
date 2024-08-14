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
  Req,
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
import { CommentAndRateServise } from './subcategoryorganization.service';
import { CreateCommentAndRateDto } from './dto/create_CommentAndRate.dto';
import { UpdateCommentAndRateDto } from './dto/update_CommentAndRate.dto';
import { CustomRequest, RolesEnum } from 'src/types';
import { RequiredRoles } from '../auth/guards/roles.decorator';

@Controller('CommentAndRate')
@ApiTags('Comment And Rate')
@ApiBearerAuth('JWT-auth')
export class CommentAndRateController {
  readonly #_service: CommentAndRateServise;
  constructor(service: CommentAndRateServise) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall() {
    return await this.#_service.findAll();
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
  // @RequiredRoles(RolesEnum.USER)
  @RequiredRoles(RolesEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['organization_id'],
      properties: {
        organization_id: {
          type: 'string',
          default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
        },
        rate: {
          type: 'number',
          default: 5,
        },
        comment: {
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
    @Req() request: CustomRequest,
    @Body() createSubCategoryOrganizationDto: CreateCommentAndRateDto
  ) {
    return await this.#_service.create(
      request.user,
      createSubCategoryOrganizationDto
    );
  }

  // // @UseGuards(jwtGuard)
  // @Patch('/update/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       category_id: {
  //         type: 'string',
  //         default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
  //       },
  //       title: {
  //         type: 'string',
  //         default: 'title',
  //       },
  //     },
  //   },
  // })
  // // @ApiOperation({ summary: 'Attendance Punch In' })
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateSubCategoryOrganizationDto: UpdateCommentAndRateDto,
  // ) {
  //   await this.#_service.update(id, updateSubCategoryOrganizationDto);
  // }

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
