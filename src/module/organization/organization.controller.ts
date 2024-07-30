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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationServise } from './organization.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateOrganizationDto } from './dto/create_organization.dto';
import { UpdateOrganizationDto } from './dto/update_organization.dto';
@Controller('organization')
@ApiTags('Organization')
@ApiBearerAuth('JWT-auth')
export class OrganizationController {
  readonly #_service: OrganizationServise;
  constructor(service: OrganizationServise) {
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
        // category_id: {
        //   type: 'string',
        //   default: '4141561fds4g964g498e',
        // },
        sub_category_id: {
          type: 'string',
          default: 'sadf456asdf65asdf564asf',
        },
        title: {
          type: 'string',
          default: 'title',
        },
        section: {
          type: 'string',
          default: 'section',
        },
        head_organization: {
          type: 'string',
          default: 'head_organization',
        },
        manager: {
          type: 'string',
          default: 'manager',
        },
        e_mail: {
          type: 'string',
          default: 'e_mail',
        },
        index: {
          type: 'string',
          default: 'index',
        },
        address: {
          type: 'string',
          default: 'address',
        },
        work_time: {
          type: 'string',
          default: 'work_time',
        },
        segment: {
          type: 'string',
          default: 'segment',
        },
        account: {
          type: 'string',
          default: 'account',
        },
        added_by: {
          type: 'string',
          default: 'added_by',
        },
        inn: {
          type: 'string',
          default: 'inn',
        },
        bank_account: {
          type: 'string',
          default: 'bank_account',
        },
        more_info: {
          type: 'string',
          default: 'bank_account',
        },
        warning: {
          type: 'string',
          default: 'Warning text goes here',
        },
        payment_type: {
          type: 'object',
          default: {
            location: [{ cash: true, terminal: false, transfer: false }],
          },
        },
        transport: {
          type: 'object',
          default: {
            location: [
              {
                bus: '8',
                gazelle: '8',
                metro_station: 'Tinchlik metro',
                micro_bus: 'Miroavtobus 135',
              },
            ],
          },
        },
        location: {
          type: 'object',
          default: {
            location: [
              { lon: '+dafijdnhsaifgnasdgvn', lat: 'agfnasdiofgnasdifn' },
            ],
          },
        },
        phones: {
          type: 'object',
          default: {
            numbers: [{ number: '+998933843484', type_number: 'mobile' }],
          },
        },
        pictures: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<void> {
    return await this.#_service.create(createOrganizationDto, files);
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
          default: '4141561fds4g964g498e',
        },
        sub_category_id: {
          type: 'string',
          default: 'sadf456asdf65asdf564asf',
        },
        title: {
          type: 'string',
          default: 'title',
        },
        section: {
          type: 'string',
          default: 'section',
        },
        head_organization: {
          type: 'string',
          default: 'head_organization',
        },
        manager: {
          type: 'string',
          default: 'manager',
        },
        e_mail: {
          type: 'string',
          default: 'e_mail',
        },
        index: {
          type: 'string',
          default: 'index',
        },
        address: {
          type: 'string',
          default: 'address',
        },
        work_time: {
          type: 'string',
          default: 'work_time',
        },

        segment: {
          type: 'string',
          default: 'segment',
        },
        account: {
          type: 'string',
          default: 'account',
        },
        added_by: {
          type: 'string',
          default: 'added_by',
        },
        inn: {
          type: 'string',
          default: 'inn',
        },
        bank_account: {
          type: 'string',
          default: 'bank_account',
        },
        more_info: {
          type: 'string',
          default: 'bank_account',
        },
        warning: {
          type: 'string',
          default: 'Warning text goes here',
        },
        payment_type: {
          type: 'object',
          default: {
            location: [{ cash: true, terminal: false, transfer: false }],
          },
        },
        transport: {
          type: 'object',
          default: {
            location: [
              {
                bus: '8',
                gazelle: '8',
                metro_station: 'Tinchlik metro',
                micro_bus: 'Miroavtobus 135',
              },
            ],
          },
        },
        location: {
          type: 'object',
          default: {
            location: [
              { lon: '+dafijdnhsaifgnasdgvn', lat: 'agfnasdiofgnasdifn' },
            ],
          },
        },
        phones: {
          type: 'object',
          default: {
            numbers: [
              {
                id: 'b2d40ef9-cf96-4e89-87a1-5cb63853751f',
                number: '+998933843484',
                type_number: 'mobile',
                action: 'create',
              },
            ],
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update Org' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<void> {
    await this.#_service.update(id, updateOrganizationDto);
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