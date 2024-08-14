import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create_user.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { SingInUserDto } from './dto/sign_in-user.dto';
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
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });

    if (findUser) {
      throw new HttpException('Number already registered', HttpStatus.FOUND);
    }
    console.log(createUser);

    const addedUser = await UsersEntity.createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values({
        full_name: createUser.full_name,
        phone: createUser.number,
        password: createUser.password,
        role: createUser.role,
      })
      .returning(['id', 'role', 'password'])
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });

    return {
      message: 'You have successfully registered',
      token: this.sign(
        addedUser.raw.at(-1).id,
        addedUser.raw.at(-1).role,
        addedUser.raw.at(-1).password,
      ),
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

  // async signInControlUser(body: ControlUserDto) {
  //   const finduser = await UsersEntity.findOne({
  //     where: {
  //       username: body.username.trim().toLowerCase(),
  //       password: body.password.trim(),
  //     },
  //   }).catch((e) => {
  //     throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
  //   });

  //   if (!finduser) {
  //     throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
  //   }
  //   return {
  //     message: 'successfully sing In',
  //     token: this.sign(finduser.id, finduser.role, finduser.password),
  //   };
  // }

  // async getSearchControlUsername(username: string) {
  //   const finduser = await UsersEntity.findOne({
  //     where: {
  //       username: username.trim().toLowerCase(),
  //     },
  //   }).catch(() => {
  //     throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
  //   });

  //   if (finduser) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

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

  // async createControlUser(body: CreateControlUserDto) {
  //   const findControlUser = await UsersEntity.findOne({
  //     where: {
  //       username: body.username.toLowerCase(),
  //     },
  //   }).catch((e) => {
  //     throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
  //   });

  //   if (findControlUser) {
  //     throw new HttpException('username alredy exist', HttpStatus.FOUND);
  //   }

  //   await UsersEntity.createQueryBuilder()
  //     .insert()
  //     .into(UsersEntity)
  //     .values({
  //       full_name: body.full_name,
  //       username: body.username.trim().toLowerCase(),
  //       password: body.password.trim(),
  //       role: body.role.toLowerCase(),
  //     })
  //     .execute()
  //     .catch((e) => {
  //       throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  //     });
  // }

  // async updateUser(id: string, body: UpdateUserDto) {
  //   const findControlUser = await UsersEntity.findOne({
  //     where: { id },
  //   });

  //   if (!findControlUser) {
  //     throw new HttpException(' USER not found', HttpStatus.NOT_FOUND);
  //   }

  //   const updatedVideo = await UsersEntity.update(id, {
  //     full_name: body.full_name || findControlUser.full_name,
  //     username: body.username.trim().toLowerCase() || findControlUser.username,
  //     password: body.password.trim() || findControlUser.password,
  //     phone: body
  //     role: body.role || findControlUser.role,
  //   });

  //   return updatedVideo;
  // }

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
