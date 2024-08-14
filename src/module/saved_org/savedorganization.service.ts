import { HttpException, HttpStatus, Injectable, Body } from '@nestjs/common';
import { CreateSavedOrganizationDto } from './dto/create_savedorganization.dto';

import { UpdateSavedOrganizationDto } from './dto/update_savedorganization.dto';

import { SubCategoryOrgEntity } from 'src/entities/sub_category_org.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { CustomHeaders, UserType } from 'src/types';
import { AuthServise } from '../auth/auth.service';
import { SavedOrganizationEntity } from 'src/entities/saved_org.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { OrganizationEntity } from 'src/entities/organization.entity';

@Injectable()
export class SavedOrganizationServise {
  readonly #_auth: AuthServise;
  constructor(auth: AuthServise) {
    this.#_auth = auth;
  }
  async findAll(user: UserType, page: string , pageSize : string) {
    if(pageSize == 'all') {
      const [result, total] = await OrganizationEntity.findAndCount({
        where: {
          saved_organization : {
            user_id: {
              id: user.userId,
            }
          }
        },
        relations: {
          phones: true,
          pictures: true,
          sub_category_org: {
            category_org: true,
          },
          saved_organization: true,
          comments: true,
        },
        order: {
          create_data: 'asc',
        },
      }).catch((e) => {
        // this.logger.error(`Error in find All Org`);
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    return {
      result  ,
      pagination: {
        currentPage: page,
        totalPages : 1,
        pageSize,
        totalItems: total,
      },
    };
    } else {
      const offset = (+page - 1) * +pageSize;

      const [result, total] = await OrganizationEntity.findAndCount({
        where: {
          saved_organization : {
            user_id: {
              id: user.userId,
            }
          }
        },
        relations: {
          phones: true,
          pictures: true,
          sub_category_org: {
            category_org: true,
          },
          saved_organization: true,
          comments: true,
        },
        order: {
          create_data: 'asc',
        },
        
      skip: offset,
      take: +pageSize,
      }).catch((e) => {
        // this.logger.error(`Error in find All Org`);
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      const totalPages = Math.ceil(total / +pageSize);
    return {
      result  ,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: total,
      },
    };

    }

  }

  async findOne(id: string) {
    const findOne = await SavedOrganizationEntity.find({
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

  async create(user: UserType, body: CreateSavedOrganizationDto) {
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

    const findSavedOrg = await SavedOrganizationEntity.findOne({
      where: {
        organization_id: {
          id: findOrganization.id,
        },
        user_id: {
          id: user.userId,
        },
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (findSavedOrg) {
      throw new HttpException(
        'Already saved organization',
        HttpStatus.NOT_FOUND,
      );
    }

    await SavedOrganizationEntity.createQueryBuilder()
      .insert()
      .into(SavedOrganizationEntity)
      .values({
        user_id: {
          id: user.userId,
        },
        organization_id: findOrganization,
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
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
    const findSavedOrganization = await SavedOrganizationEntity.findOneBy({
      id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findSavedOrganization) {
      throw new HttpException(
        'Saved Organization not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await SavedOrganizationEntity.delete({ id });
  }
}
