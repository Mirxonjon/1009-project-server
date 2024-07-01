import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create_organization.dto';
import { UpdateOrganizationDto } from './dto/update_organization.dto';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { Phone_Organization_Entity } from 'src/entities/phone_organization.entity';
import { extname } from 'path';
import { Category_Organization_Entity } from 'src/entities/category_org.entity';
import { Sub_Category_Org_Entity } from 'src/entities/sub_category_org.entity';
import { Picture_Organization_Entity } from 'src/entities/picture_organization.entity';
import { allowedImageFormats } from 'src/utils/videoAndImageFormat';
import { googleCloudAsync } from 'src/utils/google_cloud';

@Injectable()
export class OrganizationServise {
  async findAll() {
    const findAll = await OrganizationEntity.find({
      relations: {
        phones: true,
        pictures: true,
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
      where: {
        id,
      },
      relations: {
        phones: true,
        pictures: true,
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

  async create(
    body: CreateOrganizationDto,
    pictures: Array<Express.Multer.File>,
  ) {
    console.log(body);

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

    if (body.sub_category_id != 'null') {
      findSubCategory = await Sub_Category_Org_Entity.findOne({
        where: {
          id: body.sub_category_id,
        },
      }).catch((e) => {
        console.log(e);

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    }

    const createdOrg = await OrganizationEntity.createQueryBuilder()
      .insert()
      .into(OrganizationEntity)
      .values({
        title: body.title,
        section: body.section,
        head_organization: body.head_organization,
        manager: body.manager,
        e_mail: body.e_mail,
        index: body.index,
        address: body.address,
        work_time: body.work_time,
        payment_type: JSON.parse(body?.payment_type),
        transport: JSON.parse(body?.transport),
        more_info: body.more_info,
        location: JSON.parse(body?.location),
        segment: body.segment,
        account: body.account,
        added_by: body.added_by,
        inn: body.inn,
        bank_account: body.bank_account,
        sub_category_org: {
          id: findSubCategory?.id,
        },
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
    if (createdOrg) {
      let phones = JSON.parse(body?.phones);

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
              throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            });
        },
      );

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
              throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            });
        }
      });

      return;
    }
  }

  async update(id: string, body: UpdateOrganizationDto) {
    const findOrganization = await OrganizationEntity.findOne({
      where: {
        id: id,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    let findSubCategory = null;

    if (body.sub_category_id != 'null') {
      findSubCategory = await Sub_Category_Org_Entity.findOne({
        where: {
          id: body.sub_category_id,
        },
      }).catch((e) => {
        console.log(e);

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    }

    const updatedOrganization = await OrganizationEntity.update(id, {
      title: body.title || findOrganization.title,
      section: body.section || findOrganization.head_organization,
      head_organization:
        body.head_organization || findOrganization.head_organization,
      manager: body.manager || findOrganization.manager,
      e_mail: body.e_mail || findOrganization.e_mail,
      index: body.index || findOrganization.index,
      address: body.address || findOrganization.address,
      work_time: body.work_time || findOrganization.work_time,
      payment_type:
        JSON.parse(body?.payment_type) || findOrganization.payment_type,
      transport: JSON.parse(body?.transport) || findOrganization.transport,
      more_info: body.more_info || findOrganization.more_info,
      location: JSON.parse(body?.location) || findOrganization.location,
      segment: body.segment || findOrganization.segment,
      account: body.account || findOrganization.account,
      added_by: body.added_by || findOrganization.added_by,
      inn: body.inn || findOrganization.inn,
      bank_account: body.bank_account || findOrganization.bank_account,
      sub_category_org: {
        id: findSubCategory?.id || null,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (updatedOrganization) {
      console.log(body, body.phones);
      let phones = JSON.parse(body.phones);
      console.log(phones, '111');

      // let a =  JSON.parse(phones)
      // console.log(phones ,'111', a);

      phones?.numbers?.forEach(
        async (e: {
          id: string;
          number: string;
          type_number: string;
          action: string;
        }) => {
          if (e.action == 'create') {
            await Phone_Organization_Entity.createQueryBuilder()
              .insert()
              .into(Phone_Organization_Entity)
              .values({
                number: e.number,
                type_number: e.type_number,
                organization: {
                  id: id,
                },
              })
              .execute()
              .catch((e) => {
                console.log(e);
                throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
              });
          } else if (e.action == 'update') {
            const findPhone = Phone_Organization_Entity.findOne({
              where: {
                id: e.id,
              },
            });

            if (findPhone) {
              await Phone_Organization_Entity.update(e.id, {
                number: e.number,
                type_number: e.type_number,
              }).catch((e) => {
                console.log(e);
                throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
              });
            }
          } else if (e.action == 'delete') {
            const findPhone = Phone_Organization_Entity.findOne({
              where: {
                id: e.id,
              },
            }).catch((e) => {
              console.log(e);
              throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            });

            if (findPhone) {
              await Phone_Organization_Entity.delete({ id: e.id }).catch(
                (e) => {
                  console.log(e);
                  throw new HttpException(
                    'Bad Request',
                    HttpStatus.BAD_REQUEST,
                  );
                },
              );
            }
          }
        },
      );
      return;
    }
  }

  async remove(id: string) {
    const findOrganization = await OrganizationEntity.findOneBy({ id }).catch(
      () => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      },
    );

    if (!findOrganization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    await OrganizationEntity.delete({ id });
  }
}
