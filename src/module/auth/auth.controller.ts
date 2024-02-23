import { Post, Body, HttpCode, HttpStatus, Patch, Param, Get, Query } from '@nestjs/common';
import { AuthServise } from './auth.service';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SingInUserDto } from './dto/sign_in-user.dto';
import { UpdateControlUserDto } from './dto/update-conrolUser.dto';
import { CreateControlUserDto } from './dto/create_controlUser.dto';

@Controller('Auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthServise) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['full_name', 'number', 'password'],
      properties: {
        full_name: {
          type: 'string',
          default: `Eshmat Eshmatov Eshmat o'g'li`,
        },
        number: {
          type: 'string',
          default: '+998933843484',
        },
        password: {
          type: 'string',
          default: '123',
        },
      },
    },
  })
  register(@Body() body: CreateUserDto) {
    return this.service.createUser(body);
  }

  @Post('/signIn')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['numebr', 'password'],
      properties: {
        gmail: {
          type: 'string',
          default: '+998933843484',
        },
        password: {
          type: 'string',
          default: '123',
        },
      },
    },
  })
  signIn(@Body() body: SingInUserDto) {
    return this.service.signIn(body);
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(
    @Query('role') role: string,
  ) {
    return await this.service.getAllControlUsers(role);
  }



  @Post('/addControlUser')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['full_name', 'number', 'password'],
      properties: {
        full_name: {
          type: 'string',
          default: `Eshmat Eshmatov Eshmat o'g'li`,
        },
        role: {
          type: 'string',
          default: 'moderator',
        },
        username: {
          type: 'string',
          default: 'Moderator',
        },
        password: {
          type: 'string',
          default: '123',
        },
      },
    },
  })
  createControlUser(@Body() createControlUserDto: CreateControlUserDto) {
    return this.service.createControlUser(createControlUserDto);
  }

  @Patch('/addControlUser/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          default: `Eshmat Eshmatov Eshmat o'g'li`,
        },
        role: {
          type: 'string',
          default: 'moderator',
        },
        username: {
          type: 'string',
          default: 'Moderator',
        },
        password: {
          type: 'string',
          default: '123',
        },
      },
    },
  })
  // @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async updateControlUser(
    @Param('id') id: string,
    @Body() updateControlUserDto: UpdateControlUserDto,
  ) {
    await this.service.updateControlUser(id, updateControlUserDto);
  }

}
