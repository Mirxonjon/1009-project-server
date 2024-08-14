import { HttpException, HttpStatus, Injectable, Body } from '@nestjs/common';
import { CreateSavedOrganizationDto } from './dto/create_savedorganization.dto';

import { UpdateSavedOrganizationDto } from './dto/update_savedorganization.dto';

import { Sub_Category_Org_Entity } from 'src/entities/sub_category_org.entity';
import { Category_Organization_Entity } from 'src/entities/category_org.entity';
import { CustomHeaders, UserType } from 'src/types';
import { AuthServise } from '../auth/auth.service';
import { Saved_Organization_Entity } from 'src/entities/saved_org.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { OrganizationEntity } from 'src/entities/organization.entity';

@Injectable()
export class SavedOrganizationServise {
  readonly #_auth: AuthServise;
  constructor(auth: AuthServise) {
    this.#_auth = auth;
  }
  async findAll(user: UserType) {
    console.log(user);

    const findAllSavedOrganization = await Saved_Organization_Entity.find({
      where: {
        user_id: {
          id: user.userId,
        },
      },
      order: {
        create_data: 'asc',
      },
      relations: {
        user_id: true,
        organization_id: true,
      },
    }).catch((e) => {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    });

    if (!findAllSavedOrganization) {
      throw new HttpException('Not found', HttpStatus.BAD_REQUEST);
    }

    return findAllSavedOrganization;
  }

  async findOne(id: string) {
    const findOne = await Saved_Organization_Entity.find({
      where: {
        organization_id: {
          id,
        },
      },
      relations: {
        organization_id: true,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findOne;
  }

  async create(headers: CustomHeaders, body: CreateSavedOrganizationDto) {
    if (headers.authorization) {
      const data = await this.#_auth.verify(
        headers.authorization.split(' ')[1]
      );
      const userId: string = data.id;

      const findUser = await UsersEntity.findOne({
        where: {
          id: userId,
        },
      }).catch((e) => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const findOrganization = await OrganizationEntity.findOne({
        where: {
          id: body.organization_id,
        },
      }).catch((e) => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });

      if (!findOrganization) {
        throw new HttpException('Not found organization', HttpStatus.NOT_FOUND);
      }
      await Saved_Organization_Entity.createQueryBuilder()
        .insert()
        .into(Saved_Organization_Entity)
        .values({
          user_id: findUser,
          organization_id: findOrganization,
        })
        .execute()
        .catch((e) => {
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
  // async update(id: string,headers :CustomHeaders, body: UpdateSavedOrganizationDto) {
  //   const findSavedOrganization= await Saved_Organization_Entity.findOne({
  //     where: { id },

  //   });

  //   if (!findSavedOrganization) {
  //     throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
  //   }
  //   let  findCategory :Category_Organization_Entity |  null  =  null
  //   if(body.category_id) {
  //     findCategory = await Category_Organization_Entity.findOneBy({id}).catch(e => {
  //     throw new HttpException('Not found Category' , HttpStatus.NOT_FOUND)

  //   })
  //   if (!findCategory) {
  //     throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
  //   }
  // }

  //   const updatedVideo = await Sub_Category_Org_Entity.update(id, {
  //     title: body.title.toLowerCase() || findSubCategoryOrg.title,

  //     category_org: findCategory
  //   });

  //   return updatedVideo;
  // }

  async remove(id: string) {
    const findSavedOrganization = await Saved_Organization_Entity.findOneBy({
      id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findSavedOrganization) {
      throw new HttpException(
        'Saved Organization not found',
        HttpStatus.NOT_FOUND
      );
    }

    await Saved_Organization_Entity.delete({ id });
  }
}
