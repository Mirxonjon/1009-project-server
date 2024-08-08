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
        sub_category_org: true
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
    console.log(body, 'BODY');
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

    console.log(body.sub_category_id, 'BODY SUB CATEG OUT')

    if (body.sub_category_id != 'null') {
      console.log(body.sub_category_id, 'BODY SUB CATEG IN')
      findSubCategory = await Sub_Category_Org_Entity.findOne({
        where: {
          id: body.sub_category_id,
        },
      }).catch((e) => {
        console.log(e, ': SUB CATEGORY');

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    }

    console.log(findSubCategory, 'FIND BY CATEGORY')

    const createdOrg = await OrganizationEntity.createQueryBuilder()
      .insert()
      .into(OrganizationEntity)
      .values({
        organization_name: body.organization_name,
        section: body.section,
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
        sub_category_org: {
          id: findSubCategory?.id,
        },
      })
      .execute()
      .catch((e) => {
        console.log(e, ': CREATE ERROR');
        throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
      });

    console.log(createdOrg, 'CREATE ORG OUT')
    if (createdOrg) {
      console.log(createdOrg, 'CREATE ORG IN')
      let phones = body?.phones as any;

      console.log(phones, 'PHONES in IF')

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

      console.log(phones, 'AFTER INSERT PHONES')

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

      console.log(phones, 'AFTER INSERT FILES')
    }

  }

  async update(id: string, body: UpdateOrganizationDto, pictures: Array<Express.Multer.File>,) {
    const findOrganization = await OrganizationEntity.findOne({
      where: {
        id: id,
      },
    }).catch((e) => {
      console.log(e);

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
      main_organization: body.main_organization || findOrganization.main_organization,
      section: body.section || findOrganization.section,
      organization_name:
        body.organization_name || findOrganization.organization_name,
      manager: body.manager || findOrganization.manager,
      email: body.email || findOrganization.email,
      address: body.address || findOrganization.address,
      scheduler: JSON.parse(body?.scheduler as any) || findOrganization.scheduler,
      payment_type:
        JSON.parse(body?.payment_type as any) || findOrganization.payment_type,
      transport: JSON.parse(body?.transport as any) || findOrganization.transport,
      comment: body.comment || findOrganization.comment,
      location: JSON.parse(body?.location as any) || findOrganization.location,
      segment: body.segment || findOrganization.segment,
      account: body.account || findOrganization.account,
      added_by: body.added_by || findOrganization.added_by,
      inn: body.inn || findOrganization.inn,
      bank_account: body.bank_account || findOrganization.bank_account,
      sub_category_org: {
        id: findSubCategory?.id || null,
      },
    }).catch((e) => {
      console.log(e);

      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (updatedOrganization) {
      console.log(body, body.phones);
      let phones = JSON.parse(body.phones as any);
      let pictures_delete = JSON.parse(body.pictures_delete as any);
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
                id: findOrganization.id,
              },
            })
            .execute()
            .catch((e) => {
              console.log(e);

              throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
            });
        }
      });
      console.log(pictures_delete, 'pic');


      pictures_delete?.delete?.forEach(async e => {
        await Picture_Organization_Entity.delete({ id: e });
      })

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
