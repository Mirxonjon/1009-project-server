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
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsersServise } from './users.service';
import { CustomRequest, RolesEnum } from 'src/types';
import { RequiredRoles } from '../auth/guards/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update_user.dto';
@Controller('Users')
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  readonly #_service: UsersServise;
  constructor(service: UsersServise) {
    this.#_service = service;
  }

  @RequiredRoles(RolesEnum.SUPERADMIN, RolesEnum.USER, RolesEnum.ADMIN)
  @Get('/get-my-data')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findMyDate(@Req() req: CustomRequest) {
    return await this.#_service.findMyDate(req.user);
  }

  // @RequiredRoles(RolesEnum.SUPERADMIN,RolesEnum.USER,RolesEnum.ADMIN)
  @Get('/user/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
  }

  // @UseGuards(jwtGuard)
  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiQuery({ name: 'role', required: false })
  async findAll(@Query('role') role: string = 'null') {
    return await this.#_service.findAll(role);
  }

  // // @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          default: 'Eshmat',
        },
        number: {
          type: 'string',
          default: '+998933843484',
        },
        role: {
          type: 'string',
          default: 'admin',
        },
        password: {
          type: 'string',
          default: 'uuid23422',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    file: { image?: Express.Multer.File },
  ) {
    await this.#_service.update(
      id,
      updateUserDto,
      file?.image ? file?.image[0] : null,
    );
  }

  // // @UseGuards(jwtGuard)
  // @Delete('/delete/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiNoContentResponse()
  // async remove(@Param('id') id: string): Promise<void> {
  //   await this.#_service.remove(id);
  // }
}
