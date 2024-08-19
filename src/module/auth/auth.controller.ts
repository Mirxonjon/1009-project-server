import {
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Get,
  Query,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthServise } from './auth.service';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SingInUserDto } from './dto/sign_in-user.dto';
import { VerifySmsCodeDto } from './dto/verify_sms_code.dto';
import {
  UpdateNumberDto,
  UpdateNumberVerifySmsCodeDto,
} from './dto/update_number.dto';
import { RequiredRoles } from './guards/roles.decorator';
import { CustomRequest, RolesEnum } from 'src/types';
// import { UpdateControlUserDto } from './dto/update-conrolUser.dto';
// import {
//   ControlUserDto,
//   CreateControlUserDto,
// } from './dto/create_controlUser.dto';

@Controller('Auth')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly service: AuthServise) {}

  @Post('/user/register')
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

  @Post('user/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['number', 'password'],
      properties: {
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
  signIn(@Body() body: SingInUserDto) {
    return this.service.signIn(body);
  }

  @Post('user/verify-sms-code')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId', 'password'],
      properties: {
        userId: {
          type: 'string',
          default: 'fdsgsad54asdfas34f43asf234as5',
        },
        smsCode: {
          type: 'string',
          default: '1235',
        },
      },
    },
  })
  VerifySmsCode(@Body() body: VerifySmsCodeDto) {
    return this.service.verifySmsCode(body);
  }

  @Patch('/resend-sms-code/:id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {},
    },
  })
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  async resendSmsCode(@Param('id') id: string) {
    return await this.service.resendSmsCode(id);
  }

  @RequiredRoles(RolesEnum.USER, RolesEnum.SUPERADMIN)
  @Patch('/update-number')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          default: '+998933843484',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async updateNumber(@Req() req: CustomRequest, @Body() body: UpdateNumberDto) {
    console.log('okk');

    return await this.service.updateNumber(req.user, body);
  }

  @RequiredRoles(RolesEnum.USER, RolesEnum.SUPERADMIN)
  @Patch('/update-number/verify-sms-code')
  // @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          default: '+998933843484',
        },
        smsCode: {
          type: 'string',
          default: '1234',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async verifySmsCodeUpdateNumber(
    @Req() req: CustomRequest,
    @Body() body: UpdateNumberVerifySmsCodeDto
  ) {
    return await this.service.verifySmsCodeUpdateNumber(req.user, body);
  }

  @Delete('user/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.service.deleteUser(id);
  }
}
