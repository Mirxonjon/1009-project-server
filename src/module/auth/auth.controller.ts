import { Post, Body, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { AuthServise } from './auth.service';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SingInUserDto } from './dto/sign_in-user.dto';

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
}
