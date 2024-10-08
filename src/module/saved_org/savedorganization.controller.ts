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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SavedOrganizationServise } from './savedorganization.service';
import { CreateSavedOrganizationDto } from './dto/create_savedorganization.dto';
import { UpdateSavedOrganizationDto } from './dto/update_savedorganization.dto';
import { CustomHeaders, CustomRequest, RolesEnum } from 'src/types';
import { RequiredRoles } from '../auth/guards/roles.decorator';

@Controller('SavedOrganization')
@ApiTags('Saved Organization')
@ApiBearerAuth('JWT-auth')
export class SavedOrganizationController {
  readonly #_service: SavedOrganizationServise;
  constructor(service: SavedOrganizationServise) {
    this.#_service = service;
  }
  @RequiredRoles(RolesEnum.SUPERADMIN, RolesEnum.USER)
  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async findall(
    @Req() req: CustomRequest,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10'
  ) {
    return await this.#_service.findAll(req.user, page, pageSize);
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
  @RequiredRoles(RolesEnum.USER)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category_id', 'title'],
      properties: {
        oraganization_id: {
          type: 'string',
          default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
        },
      },
    },
  })
  // @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Req() req: CustomRequest,
    @Body() createSubCategoryOrganizationDto: CreateSavedOrganizationDto
  ) {
    return await this.#_service.create(
      req.user,
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
  //       oraganization_id: {
  //         type: 'string',
  //         default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
  //       },
  //     },
  //   },
  // })
  // // @ApiOperation({ summary: 'Attendance Punch In' })
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // async update(
  //   @Param('id') id: string,
  //   @Headers() headers: CustomHeaders,
  //   @Body() updateSubCategoryOrganizationDto: UpdateSavedOrganizationDto,
  // ) {
  //   await this.#_service.update(id, headers,updateSubCategoryOrganizationDto);
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
