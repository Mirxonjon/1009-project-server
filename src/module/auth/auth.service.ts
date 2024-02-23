import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { SingInUserDto } from './dto/sign_in-user.dto';
import { CreateControlUserDto } from './dto/create-ControlUser.dto';
import { ControlUsersEntity } from 'src/entities/control_users.entity';
import { UpdateControlUserDto } from './dto/update-conrolUser.dto';

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
      throw new HttpException(
        'Gmail or Number already registered',
        HttpStatus.FOUND,
      );
    }

    const addedUser = await UsersEntity.createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values({
     full_name : createUser.full_name,
     number : createUser.number ,
     password : createUser.password
      })
      .returning(['id', 'role'])
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });

    return {
      message: 'You have successfully registered',
      token: this.sign(addedUser.raw.at(-1).id, addedUser.raw.at(-1).role),
    };
  }
  async signIn(signInDto: SingInUserDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        // email: signInDto.gmail,
        password: signInDto.password,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'successfully sing In',
      token: this.sign(finduser.id, finduser.role),
    };
  }

  sign(id: string, role: string) {
    return this.jwtServise.sign({ id, role });
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

  async getAllControlUsers(role :string) {
    const findControlUser = await ControlUsersEntity.findOne({
     where : {
      role:role == 'operator' || role == 'moderator' ? role : null 
     }
    }).catch((e) => {
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });
    return findControlUser
  }

  async createControlUser(body : CreateControlUserDto) {
    const findControlUser = await ControlUsersEntity.findOne({
      where :{
        username: body.username
      }
    }).catch((e) => {
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });
//     console.log(body); 
// console.log(findControlUser);

    if(findControlUser) {
      throw new HttpException('username alredy exist', HttpStatus.FOUND);
    }
    
     await ControlUsersEntity.createQueryBuilder()
    .insert()
    .into(ControlUsersEntity)
    .values({
   full_name : body.full_name,
   username: body.username,
   password : body.password,
   role: body.role
    })
    .execute()
    .catch((e) => {
      console.log(e);
      
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });

  }

  async updateControlUser(id :string ,body: UpdateControlUserDto) {

    const findControlUser = await ControlUsersEntity.findOne({
      where: { id },
    });

    if (!findControlUser) {
      throw new HttpException('Control not found', HttpStatus.NOT_FOUND);
    }

    const updatedVideo = await ControlUsersEntity.update(id, {
     full_name :body.full_name || findControlUser.full_name,
     username: body.username || findControlUser.username,
     password: body.password || findControlUser.password,
     role: body.role || findControlUser.role 
    });

    return updatedVideo;
  }


}
