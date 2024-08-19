import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create_user.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { SingInUserDto } from './dto/sign_in-user.dto';
import {
  generateRandomNumber,
  secondsSinceGivenTime,
} from 'src/utils/generateNumber';
import { VerifySmsCodeDto } from './dto/verify_sms_code.dto';
import {
  UpdateNumberDto,
  UpdateNumberVerifySmsCodeDto,
} from './dto/update_number.dto';
import { UserType } from 'src/types';
// import { ControlUsersEntity } from 'src/entities/control_users.entity';

// import { UpdateUserDto } from '../users/dto/update_book.dto';

@Injectable()
export class AuthServise {
  constructor(private readonly jwtServise: JwtService) {}
  async createUser(createUser: CreateUserDto) {
    const findUser = await UsersEntity.findOne({
      where: {
        phone: createUser.number,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (findUser) {
      throw new HttpException('Number already registered', HttpStatus.FOUND);
    }
    console.log(createUser);

    const smsCode = await generateRandomNumber();

    const addedUser = await UsersEntity.createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values({
        full_name: createUser.full_name,
        phone: createUser.number,
        password: createUser.password,
        role: createUser.role,
        sms_code: smsCode,
        attempt: 1,
        otp_duration: new Date(),
      })
      .returning(['id', 'role', 'password'])
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });

    return {
      message: 'You have successfully registered',

      smsCode: smsCode,
      userId: addedUser.raw.at(-1).id,
      // token: this.sign(
      //   addedUser.raw.at(-1).id,
      //   addedUser.raw.at(-1).role,
      //   addedUser.raw.at(-1).password,
      // ),
    };
  }

  async signIn(signInDto: SingInUserDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        phone: signInDto.number,
        password: signInDto.password,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'successfully sing In',
      token: this.sign(finduser.id, finduser.role, finduser.password),
    };
  }

  async verifySmsCode(verifySmsCodeDto: VerifySmsCodeDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        id: verifySmsCodeDto.userId,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }

    const differenceSeconds = await secondsSinceGivenTime(
      finduser.otp_duration
    );
    console.log(differenceSeconds);

    if (differenceSeconds > 60) {
      throw new HttpException('Time is over', HttpStatus.BAD_REQUEST);
    }

    if (finduser.sms_code != +verifySmsCodeDto.smsCode) {
      const updated = await UsersEntity.update(finduser.id, {
        attempt: finduser.attempt + 1,
      });
      throw new HttpException('Code is not correct', HttpStatus.BAD_REQUEST);
    }

    const updated = await UsersEntity.update(finduser.id, {
      attempt: 0,
    });
    return {
      message: 'successfully',
      token: this.sign(finduser.id, finduser.role, finduser.password),
    };
  }

  async resendSmsCode(id: string) {
    const finduser = await UsersEntity.findOne({
      where: {
        id,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }

    if (finduser.attempt > 3) {
      throw new HttpException('attempt is over', HttpStatus.BAD_REQUEST);
    }
    const smsCode = await generateRandomNumber();
    const updated = await UsersEntity.update(finduser.id, {
      sms_code: smsCode,
      attempt: finduser.attempt + 1,
      otp_duration: new Date(),
    }).catch((e) => {
      throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    });

    if (updated) {
      console.log({
        message: 'Resend code successfully',
        userId: finduser.id,
        smsCode,
      });
      return {
        message: 'Resend code successfully',
        userId: finduser.id,
        smsCode,
      };
    }
  }

  async updateNumber(user: UserType, UpdateNumberDto: UpdateNumberDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        id: user.userId,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });
    console.log('okk');

    if (!finduser) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    const smsCode = await generateRandomNumber();

    const updated = await UsersEntity.update(finduser.id, {
      // phone: UpdateNumberDto.number,
      sms_code: smsCode,
      attempt: finduser.attempt + 1,
      otp_duration: new Date(),
    }).catch((e) => {
      throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
    });

    if (updated) {
      console.log({
        message: 'Resend code successfully',
        userId: finduser.id,
        smsCode,
      });
      return {
        message: 'Resend code successfully',
        userId: finduser.id,
        smsCode,
      };
    }

    return {
      message: 'resend code successfully',
      smsCode,
      userId: finduser.id,
    };
  }
  async verifySmsCodeUpdateNumber(
    user: UserType,
    UpdateNumberVerifySmsCodeDto: UpdateNumberVerifySmsCodeDto
  ) {
    const finduser = await UsersEntity.findOne({
      where: {
        id: user.userId,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }

    const differenceSeconds = await secondsSinceGivenTime(
      finduser.otp_duration
    );

    if (differenceSeconds > 60) {
      throw new HttpException('Time is over', HttpStatus.BAD_REQUEST);
    }

    if (finduser.sms_code != +UpdateNumberVerifySmsCodeDto.smsCode) {
      const updated = await UsersEntity.update(finduser.id, {
        attempt: finduser.attempt + 1,
      });
      throw new HttpException('Code is not correct', HttpStatus.BAD_REQUEST);
    }

    const updated = await UsersEntity.update(finduser.id, {
      phone: UpdateNumberVerifySmsCodeDto.number,
      attempt: 0,
    });
    if (updated) {
      return {
        message: 'successfully',
        token: this.sign(finduser.id, finduser.role, finduser.password),
      };
    }
  }

  async getAllControlUsers(role: string) {
    const findControlUser = await UsersEntity.find({
      where: {
        role: role == 'null' ? null : role,
      },
      order: {
        create_data: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });

    return findControlUser;
  }

  async deleteUser(id: string) {
    const findControlUser = await UsersEntity.findOne({
      where: { id },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findControlUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await UsersEntity.delete({ id });
  }

  async validateUser(id: string, pass: string): Promise<any> {
    console.log('qqqq', id);

    const user = await UsersEntity.findOne({
      where: { id },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  sign(id: string, role: string, password: string) {
    return this.jwtServise.sign({ id, role, password });
  }

  async verify(token: string) {
    try {
      const verifytoken = await this.jwtServise
        .verifyAsync(token)
        .catch((e) => {
          // throw new UnauthorizedException(e);
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });
      return verifytoken;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
