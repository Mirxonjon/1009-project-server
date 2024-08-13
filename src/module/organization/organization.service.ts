import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create_organization.dto';
import { UpdateOrganizationDto } from './dto/update_organization.dto';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { Phone_Organization_Entity } from 'src/entities/phone_organization.entity';
import { extname } from 'path';
import { Category_Organization_Entity } from 'src/entities/category_org.entity';
import { Sub_Category_Org_Entity } from 'src/entities/sub_category_org.entity';
import { Picture_Organization_Entity } from 'src/entities/picture_organization.entity';
import { allowedImageFormats } from 'src/utils/videoAndImageFormat';
import { deleteFileCloud, googleCloudAsync } from 'src/utils/google_cloud';
import {
  PhoneAction,
  PhoneActionEnum,
  RolesEnum,
  TNumbers,
  UserType,
  OrganizationStatus,
} from 'src/types';
import { UsersEntity } from 'src/entities/users.entity';
import { Section_Entity } from 'src/entities/section.entity';
import { Not } from 'typeorm';

@Injectable()
export class OrganizationServise {
  private logger = new Logger(OrganizationServise.name);

  async findAll() {
    const findAll = await OrganizationEntity.find({
      relations: {
        phones: true,
        pictures: true,
        sub_category_org: {
          category_org: true,
        },
        saved_organization: true,
      },
      order: {
        create_data: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAll;
  }

  async findOne(id: string) {
    const findOne = await OrganizationEntity.find({
      where: [
        {
          id,
          // comments: {
          //   comment:  Not(null)
          // }
        },
        {
          id,
          comments: {
            comment: Not(null),
          },
        },
      ],
      relations: {
        sectionId: true,
        phones: true,
        pictures: true,
        comments: {
          user_id: true,
        },
        sub_category_org: {
          category_org: true,
        },
        saved_organization: true,
      },
      order: {
        create_data: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findOne) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return findOne;
  }

  async findMyOrganization(user: UserType) {
    // console.log(us);

    const findMyOrganization = await UsersEntity.findOne({
      where: {
        id: user.userId,
      },
      relations: {
        my_organization: {
          sectionId: true,
          comments: true,
          phones: true,
          pictures: true,
          sub_category_org: {
            category_org: true,
          },
          saved_organization: true,
        },
      },
      order: {
        create_data: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findMyOrganization) {
      this.logger.error(`Error in find My Org`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return findMyOrganization;
  }

  async create(
    user: UserType,
    body: CreateOrganizationDto,
    pictures: Array<Express.Multer.File>,
  ) {
    console.log(body, 'BODY');
    this.logger.debug(body, 'BODY');
    console.log(pictures, 'picture');
    // let findCategory = null

    // if(body.category_id != 'null') {
    //    findCategory = await Category_Organization_Entity.findOne({
    //     where: {
    //       id: body.category_id
    //     }
    //   }).catch(e =>{
    //     console.log(e);

    //     throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    //   })
    // }

    let findSubCategory = null;

    console.log(body.sub_category_id, 'BODY SUB CATEG OUT');

    if (body.sub_category_id != 'null') {
      console.log(body.sub_category_id, 'BODY SUB CATEG IN');
      findSubCategory = await Sub_Category_Org_Entity.findOne({
        where: {
          id: body.sub_category_id,
        },
      }).catch((e) => {
        console.log(e, ': SUB CATEGORY');

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    }

    let findSection = null;

    console.log(body.section, 'BODY SUB CATEG OUT');

    if (body.section != 'null') {
      console.log(body.section, 'BODY SUB CATEG IN');
      findSection = await Section_Entity.findOne({
        where: {
          id: body.section,
        },
      }).catch((e) => {
        console.log(e, ': SUB CATEGORY');

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    }

    console.log(findSection, 'FIND BY CATEGORY');

    const createdOrg = await OrganizationEntity.createQueryBuilder()
      .insert()
      .into(OrganizationEntity)
      .values({
        organization_name: body.organization_name,
        // section: body.section,
        main_organization: body.main_organization,
        manager: body.manager,
        email: body.email,
        // index: body.index,
        address: body.address,
        scheduler: JSON.stringify(body?.scheduler as any),
        payment_type: JSON.stringify(body?.payment_type as any),
        transport: JSON.stringify(body?.transport as any),
        comment: body.comment,
        location: JSON.stringify(body?.location as any),
        segment: body.segment,
        account: body.account,
        added_by: body.added_by,
        inn: body.inn,
        bank_account: body.bank_account,
        sectionId: findSection,
        status:
          user.role == RolesEnum.SUPERADMIN
            ? OrganizationStatus.Accepted
            : OrganizationStatus.Unaccepted,
        sub_category_org: {
          id: findSubCategory?.id,
        },
        userId: {
          id: user.userId,
        },
      })
      .execute()
      .catch((e) => {
        console.log(e, ': CREATE ERROR');
        throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
      });

    console.log(createdOrg, 'CREATE ORG OUT');
    if (createdOrg) {
      console.log(createdOrg, 'CREATE ORG IN');
      const phones = body?.phones as any;

      console.log(phones, 'PHONES in IF');

      phones?.numbers?.forEach(
        async (e: { number: string; type_number: string }) => {
          await Phone_Organization_Entity.createQueryBuilder()
            .insert()
            .into(Phone_Organization_Entity)
            .values({
              number: e.number,
              type_number: e.type_number,
              organization: {
                id: createdOrg.raw[0].id,
              },
            })
            .execute()
            .catch((e) => {
              console.log(e, ': PHONE CREATE');
              throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            });
        },
      );

      console.log(phones, 'AFTER INSERT PHONES');

      pictures?.forEach(async (e: Express.Multer.File) => {
        const formatImage = extname(e?.originalname).toLowerCase();
        if (allowedImageFormats.includes(formatImage)) {
          const linkImage: string = await googleCloudAsync(e);

          await Picture_Organization_Entity.createQueryBuilder()
            .insert()
            .into(Picture_Organization_Entity)
            .values({
              image_link: linkImage,
              organization_id: {
                id: createdOrg.raw[0].id,
              },
            })
            .execute()
            .catch((e) => {
              console.log(e, 'create picture');
              throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            });
        }
      });

      console.log(phones, 'AFTER INSERT FILES');
    }
  }

  async update(
    id: string,
    body: UpdateOrganizationDto,
    pictures: Array<Express.Multer.File>,
  ) {
    const phones = body?.phones as any;
    console.log(body, typeof phones, phones.numbers, ' : numbersd1');
    const findOrganization = await OrganizationEntity.findOne({
      where: {
        id: id,
      },
    }).catch((e) => {
      console.log(e);

      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    let findSubCategory = findOrganization.sub_category_org;

    if (body.sub_category_id != 'null') {
      findSubCategory = await Sub_Category_Org_Entity.findOne({
        where: {
          id: body.sub_category_id,
        },
      }).catch((e) => {
        console.log(e);
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
    }

    let findSection = findOrganization.sectionId;

    console.log(body.section, 'BODY SUB CATEG OUT');

    if (body.section != 'null') {
      console.log(body.section, 'BODY SUB CATEG IN');
      findSection = await Section_Entity.findOne({
        where: {
          id: body.section,
        },
      }).catch((e) => {
        console.log(e, ': SUB CATEGORY');

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    }

    const updatedOrganization = await OrganizationEntity.update(id, {
      main_organization:
        body.main_organization || findOrganization.main_organization,
      organization_name:
        body.organization_name || findOrganization.organization_name,
      manager: body.manager || findOrganization.manager,
      email: body.email || findOrganization.email,
      address: body.address || findOrganization.address,
      scheduler:
        JSON.stringify(body?.scheduler as any) || findOrganization.scheduler,
      payment_type:
        JSON.stringify(body?.payment_type as any) ||
        findOrganization.payment_type,
      transport:
        JSON.stringify(body?.transport as any) || findOrganization.transport,
      comment: body.comment || findOrganization.comment,
      location:
        JSON.stringify(body?.location as any) || findOrganization.location,
      segment: body.segment || findOrganization.segment,
      account: body.account || findOrganization.account,
      added_by: body.added_by || findOrganization.added_by,
      inn: body.inn || findOrganization.inn,
      bank_account: body.bank_account || findOrganization.bank_account,
      sectionId: findSection,
      sub_category_org: {
        id: findSubCategory?.id || null,
      },
    }).catch((e) => {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    });

    if (updatedOrganization) {
      let phones: string | TNumbers = body?.phones;

      if (typeof phones === 'string') {
        phones = JSON.parse(phones) as { numbers: PhoneAction[] };
        console.log(phones);
      }

      const allPhones = phones?.numbers;

      for (let i = 0; i < allPhones.length; i++) {
        if (allPhones[i].action == PhoneActionEnum.create) {
          await Phone_Organization_Entity.createQueryBuilder()
            .insert()
            .into(Phone_Organization_Entity)
            .values({
              number: allPhones[i].number,
              type_number: allPhones[i].type_number,
              organization: {
                id: id,
              },
            })
            .execute()
            .catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
        } else if (allPhones[i].action == PhoneActionEnum.update) {
          const findPhone = await Phone_Organization_Entity.findOne({
            where: {
              id: allPhones[i].id,
            },
          });

          if (findPhone) {
            await Phone_Organization_Entity.update(allPhones[i].id, {
              number: allPhones[i].number,
              type_number: allPhones[i].type_number,
            }).catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
          }
        } else if (allPhones[i].action == PhoneActionEnum.create) {
          const findPhone = await Phone_Organization_Entity.findOne({
            where: {
              id: allPhones[i].id,
            },
          }).catch((e) => {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
          });

          if (findPhone) {
            await Phone_Organization_Entity.delete({
              id: allPhones[i].id,
            }).catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
          } else {
            throw new HttpException('Not found number', HttpStatus.NOT_FOUND);
          }
        }
      }
    }
    console.log('okkk1');

    for (let i = 0; i < pictures?.length; i++) {
      const formatImage = extname(pictures[i]?.originalname).toLowerCase();
      if (allowedImageFormats.includes(formatImage)) {
        const linkImage: string = await googleCloudAsync(pictures[i]);

        await Picture_Organization_Entity.createQueryBuilder()
          .insert()
          .into(Picture_Organization_Entity)
          .values({
            image_link: linkImage,
            organization_id: {
              id: findOrganization.id,
            },
          })
          .execute()
          .catch((e) => {
            console.log(e);

            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
          });
      }
    }

    let pictures_delete: string | { delete: string[] } = body.pictures_delete;

    if (typeof pictures_delete === 'string') {
      pictures_delete = JSON.parse(pictures_delete) as { delete: string[] };
      console.log(pictures_delete);
    }
    const AllPictureDelete = pictures_delete.delete;
    for (let i = 0; i < AllPictureDelete.length; i++) {
      const findPicture = await Picture_Organization_Entity.findOne({
        where: {
          id: AllPictureDelete[i],
        },
      });

      if (!findPicture) {
        throw new HttpException('Not found picture', HttpStatus.NOT_FOUND);
      }
      await deleteFileCloud(AllPictureDelete[i]);
      await Picture_Organization_Entity.delete({
        id: AllPictureDelete[i],
      }).catch((e) => {
        console.log(e);
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
    }
    // pictures_delete?.delete?.forEach(async e => {
    //   const  findPicture = await Picture_Organization_Entity.findOne({
    //     where:{
    //       id : e
    //     }
    //   })

    //   if(!findPicture) {
    //     throw new HttpException(
    //       "Not found picture",
    //        HttpStatus.NOT_FOUND,
    //      );
    //   }
    //   await deleteFileCloud(e)
    //   await Picture_Organization_Entity.delete({ id: e }).catch((e) => {
    //     console.log(e);
    //     throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    //   });;

    // })
    console.log('okkk');

    return;
    // }
  }

  async remove(id: string) {
    console.log('keld');

    const findOrganization = await OrganizationEntity.findOne({
      where: {
        id,
      },
      relations: {
        pictures: true,
      },
    }).catch((e) => {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    });

    console.log('keldoooooo');

    if (!findOrganization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    // await findOrganization.pictures.forEach(async e=> {
    //   await deleteFileCloud(e.image_link)
    // })

    await OrganizationEntity.delete({ id }).catch((e) => {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    });
  }
}
