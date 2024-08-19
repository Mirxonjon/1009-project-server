import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create_organization.dto';
import { UpdateOrganizationDto } from './dto/update_organization.dto';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { PhoneOrganizationEntity } from 'src/entities/phone_organization.entity';
import { extname } from 'path';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { SubCategoryOrgEntity } from 'src/entities/sub_category_org.entity';
import { PictureOrganizationEntity } from 'src/entities/picture_organization.entity';
import { allowedImageFormats } from 'src/utils/videoAndImageFormat';
import { deleteFileCloud, googleCloudAsync } from 'src/utils/google_cloud';
import {
  PhoneAction,
  PhoneActionEnum,
  RolesEnum,
  TNumbers,
  UserType,
  OrganizationStatus,
  checkOrganizationType,
  CheckOrganizationStatus,
  OrganizationStatusType,
} from 'src/types';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { OrganizationVersionsEntity } from 'src/entities/organization_versions.entity';
import { CheckOrganizationDto } from './dto/check_organization.dto';
import { PictureOrganizationVersionsEntity } from 'src/entities/picture_organization_versions.entity';
import { Phone_Organization_Versions_Entity } from 'src/entities/phone_organizations_versions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { SectionEntity } from 'src/entities/section.entity';
import { Not } from 'typeorm';

@Injectable()
export class OrganizationServise {
  private logger = new Logger(OrganizationServise.name);

  async findAll(page: string, pageSize: string) {
    if (pageSize == 'all') {
      const [result, total] = await OrganizationEntity.findAndCount({
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
        this.logger.error(`Error in find All Org`);
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
      return {
        result,
        pagination: {
          currentPage: page,
          totalPages: 1,
          pageSize,
          totalItems: total,
        },
      };
    } else {
      const offset = (+page - 1) * +pageSize;

      const [result, total] = await OrganizationEntity.findAndCount({
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
        this.logger.error(`Error in find All Org`);
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      const totalPages = Math.ceil(total / +pageSize);
      return {
        result,
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

  async findMyOrganization(user: UserType, page: string, pageSize: string) {
    if (pageSize == 'all') {
      const [result, total] = await OrganizationEntity.findAndCount({
        where: {
          userId: {
            id: user.userId
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
        this.logger.error(`Error in find All Org`);
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
      return {
        result,
        pagination: {
          currentPage: page,
          totalPages: 1,
          pageSize,
          totalItems: total,
        },
      };
    } else {
      const offset = (+page - 1) * +pageSize;

      const [result, total] = await OrganizationEntity.findAndCount({
        where: {
          userId: {
            id: user.userId
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
        this.logger.error(`Error in find All Org`);
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      const totalPages = Math.ceil(total / +pageSize);
      return {
        result,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize,
          totalItems: total,
        },
      };

      // console.log(us);

      // const findMyOrganization = await UsersEntity.findOne({
      //   where: {
      //     id: user.userId,
      //   },
      //   relations: {
      //     my_organization: {
      //       sectionId: true,
      //       comments: true,
      //       phones: true,
      //       pictures: true,
      //       sub_category_org: {
      //         category_org: true,
      //       },
      //       saved_organization: true,
      //     },
      //   },
      //   order: {
      //     create_data: 'asc',
      //   },
      // }).catch((e) => {
      //   throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      // });

      // if (!findMyOrganization) {
      //   this.logger.error(`Error in find My Org`);
      //   throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      // }

      // return findMyOrganization;
    }
  }

  async create(
    user: UserType,
    body: CreateOrganizationDto,
    pictures: Array<Express.Multer.File>
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
      findSubCategory = await SubCategoryOrgEntity.findOne({
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
      findSection = await SectionEntity.findOne({
        where: {
          id: body.section,
        },
      }).catch((e) => {
        console.log(e, ': SUB CATEGORY');

        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    }

    console.log(findSection, 'FIND BY CATEGORY');
    // console.log(body, 'BODY');

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
        scheduler: JSON.parse(body.scheduler as any),
        payment_types: JSON.parse(body.payment_types as any),
        transport: JSON.parse(body.transport as any),
        comment: body.comment,
        location: JSON.parse(body.location as any),
        segment: body.segment,
        account: body.account,
        added_by: body.added_by,
        inn: body.inn,
        bank_account: body.bank_account,
        sectionId: findSection,
        status:
          user.role == RolesEnum.SUPERADMIN
            ? OrganizationStatus.Accepted
            : OrganizationStatus.Check,
        sub_category_org: {
          id: findSubCategory?.id,
        },
        userId: {
          id: user.userId,
        },
      })
      .execute()
      .catch((e) => {
        console.log('1111', e, ': CREATE ERROR');
        throw new HttpException(`${e.message}`, HttpStatus.BAD_REQUEST);
      });



    console.log(createdOrg, 'CREATE ORG OUT');
    if (createdOrg) {
      console.log(createdOrg, 'CREATE ORG IN');
      let phones =  JSON.parse(body.phones as any)

      console.log(phones, 'PHONES in IF');

      phones?.numbers?.forEach(
        async (e: { number: string; type_number: string }) => {
          await PhoneOrganizationEntity.createQueryBuilder()
            .insert()
            .into(PhoneOrganizationEntity)
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
        }
      );

      console.log(phones, 'AFTER INSERT PHONES');
      console.log(pictures, ' INSERT picture');
      pictures?.forEach(async (e: Express.Multer.File) => {
        const formatImage = extname(e?.originalname).toLowerCase();
        if (allowedImageFormats.includes(formatImage)) {
          const linkImage: string = await googleCloudAsync(e);

          await PictureOrganizationEntity.createQueryBuilder()
            .insert()
            .into(PictureOrganizationEntity)
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

      await this.createOrgVersion(createdOrg.identifiers[0].id)

      console.log(pictures, 'AFTER INSERT FILES');
    }
  }

  async createOrgVersion(organizationId: string): Promise<string> {
    const methodName = this.check.name;
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    try {
      // find organization
      const findOrganizationResult: OrganizationEntity | undefined =
        await OrganizationEntity.findOne({
          where: [
            {
              id: organizationId,
            },
          ],
        });

      if (findOrganizationResult) {
        this.logger.debug(
          `Method: ${methodName} - Organization Not Found: `,
          findOrganizationResult
        );
        throw new HttpException('Organization Not Found', HttpStatus.NOT_FOUND);
      }

      const organizationVersionResult: InsertResult =
        await OrganizationVersionsEntity.createQueryBuilder()
          .insert()
          .into(OrganizationVersionsEntity)
          .values({
            organization_id: findOrganizationResult.id,
            organization_name: findOrganizationResult.organization_name,
            main_organization: findOrganizationResult.main_organization,
            manager: findOrganizationResult.manager,
            email: findOrganizationResult.email,
            address: findOrganizationResult.address,
            scheduler: findOrganizationResult.scheduler,
            payment_types: findOrganizationResult.payment_types,
            transport: findOrganizationResult.transport,
            comment: findOrganizationResult.comment,
            location: findOrganizationResult.location,
            segment: findOrganizationResult.segment,
            account: findOrganizationResult.account,
            added_by: findOrganizationResult.added_by,
            inn: findOrganizationResult.inn,
            bank_account: findOrganizationResult.bank_account,
            common_rate: findOrganizationResult.common_rate,
            number_of_raters: findOrganizationResult.number_of_raters,
            status: findOrganizationResult.status,
            sub_category_org: findOrganizationResult.sub_category_org.toString(),
            sectionId: findOrganizationResult.sectionId.toString(),
            userId: findOrganizationResult.userId.toString(),
          })
          .execute();

      this.logger.debug(
        `Method: ${methodName} - organizationVersionResult:`,
        organizationVersionResult
      );

      if (!organizationVersionResult.identifiers[0].id) {
        this.logger.debug(
          `Method: ${methodName} - organizationVersion insert error:`,
          organizationVersionResult
        );
        throw new HttpException(
          `Error in inserting to organization version`,
          HttpStatus.BAD_REQUEST
        );
      }

      // find phone by organization id
      const findPhonesResult = await PhoneOrganizationEntity.find({
        where: [
          {
            organization: { id: findOrganizationResult.id },
          },
        ],
      });

      if (!findPhonesResult) {
        this.logger.debug(
          `Method: ${methodName} - Phones Not Found: `,
          findPhonesResult
        );
        throw new HttpException('Phones Not Found', HttpStatus.NOT_FOUND);
      }

      // inserting phones to version
      for (let i = 0; i < findPhonesResult.length; i++) {
        const insertPhoneVersionResult =
          await Phone_Organization_Versions_Entity.createQueryBuilder()
            .insert()
            .into(Phone_Organization_Versions_Entity)
            .values({
              number: findPhonesResult[i].number,
              type_number: findPhonesResult[i].type_number,
              organization: organizationVersionResult.identifiers[0].id,
            })
            .execute();

        this.logger.debug(
          `Method: ${methodName} - insertPhoneVersionResult:`,
          insertPhoneVersionResult
        );

        if (!insertPhoneVersionResult.identifiers[0].id) {
          this.logger.debug(
            `Method: ${methodName} - insertPhoneVersionResult Insert Error:`,
            insertPhoneVersionResult
          );
          throw new HttpException(
            `Error in inserting to Phone Version`,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      // find picture by organization id
      const findPicturesResult = await PictureOrganizationEntity.find({
        where: [
          {
            id: findOrganizationResult.id,
          },
        ],
      });

      if (!findPicturesResult) {
        this.logger.debug(
          `Method: ${methodName} - Pictures Not Found: `,
          findPicturesResult
        );
        throw new HttpException('Pictures Not Found', HttpStatus.NOT_FOUND);
      }

      // insert picture to version
      for (let i = 0; i < findPicturesResult.length; i++) {
        const insertPictureVersionResult =
          await PictureOrganizationVersionsEntity.createQueryBuilder()
            .insert()
            .into(PictureOrganizationVersionsEntity)
            .values({
              image_link: findPicturesResult[i].image_link,
              organization_id: organizationVersionResult.identifiers[0].id,
            })
            .execute();

        this.logger.debug(
          `Method: ${methodName} - insertPictureVersionResult:`,
          insertPictureVersionResult
        );

        if (!insertPictureVersionResult.identifiers[0].id) {
          this.logger.debug(
            `Method: ${methodName} - insertPictureVersionResult Insert Error:`,
            insertPictureVersionResult
          );
          throw new HttpException(
            `Error in inserting to Picture Version`,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      return organizationVersionResult.identifiers[0].id;
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error trace: `, error.trace);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: string,
    body: UpdateOrganizationDto,
    pictures: Array<Express.Multer.File>,
  ) {
    let phones = body?.phones as any;
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
      findSubCategory = await SubCategoryOrgEntity.findOne({
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
      findSection = await SectionEntity.findOne({
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
      // scheduler: JSON.stringify(body?.scheduler as any) || findOrganization.scheduler,
      // payment_types:
      // JSON.stringify(body?.payment_types as any) || findOrganization.payment_types,
      // transport: JSON.stringify(body?.transport as any) || findOrganization.transport,
      // comment: body.comment || findOrganization.comment,
      // location: JSON.stringify(body?.location as any) || findOrganization.location,
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
console.log(updatedOrganization, 'UPDATED ORG');

    if (updatedOrganization) {
      let phones: string | TNumbers = body?.phones;

      if (typeof phones === 'string') {
        phones = JSON.parse(phones) as { numbers: PhoneAction[] };
        console.log(phones);
      }

      let allPhones = phones?.numbers;

      for (let i = 0; i < allPhones.length; i++) {
        if (allPhones[i].action == PhoneActionEnum.create) {
          await PhoneOrganizationEntity.createQueryBuilder()
            .insert()
            .into(PhoneOrganizationEntity)
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
          const findPhone = await PhoneOrganizationEntity.findOne({
            where: {
              id: allPhones[i].id,
            },
          });

          if (findPhone) {
            await PhoneOrganizationEntity.update(allPhones[i].id, {
              number: allPhones[i].number,
              type_number: allPhones[i].type_number,
            }).catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
          }
        } else if (allPhones[i].action == PhoneActionEnum.create) {
          const findPhone = await PhoneOrganizationEntity.findOne({
            where: {
              id: allPhones[i].id,
            },
          }).catch((e) => {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
          });

          if (findPhone) {
            await PhoneOrganizationEntity.delete({ id: allPhones[i].id }).catch(
              (e) => {
                console.log(e);
                throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
              },
            );
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

        await PictureOrganizationEntity.createQueryBuilder()
          .insert()
          .into(PictureOrganizationEntity)
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
    let AllPictureDelete = pictures_delete.delete;
    for (let i = 0; i < AllPictureDelete.length; i++) {
      const findPicture = await PictureOrganizationEntity.findOne({
        where: {
          id: AllPictureDelete[i],
        },
      });

      if (!findPicture) {
        throw new HttpException('Not found picture', HttpStatus.NOT_FOUND);
      }
      await deleteFileCloud(AllPictureDelete[i]);
      await PictureOrganizationEntity.delete({ id: AllPictureDelete[i] }).catch(
        (e) => {
          console.log(e);
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        },
      );
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

  async check(organizationId: string, status: checkOrganizationType) {
    const methodName = this.check.name;
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    try {
      const organizationVersion = await OrganizationVersionsEntity.findOne({
        where: [
          { organization_id: organizationId }
        ]
      })

      const organization = await OrganizationEntity.findOne({
        where: [
          { id: organizationId }
        ]
      })

      const phones = await PhoneOrganizationEntity.findOne({
        where: [
          { organization: { id: organization.id }, }
        ]
      })

      const phonesVersion = await Phone_Organization_Versions_Entity.findOne({
        where: [
          { organization: { id: organization.id }, }
        ]
      })

      const pictures = await PictureOrganizationEntity.findOne({
        where: [
          { organization_id: { id: organization.id }, }
        ]
      })

      const picturesVersion = await PictureOrganizationVersionsEntity.findOne({
        where: [
          { organization_id: { id: organization.id }, }
        ]
      })

      const subCategoryOrg = await SubCategoryOrgEntity.findOne({
        where: [
          { id: organizationVersion.sub_category_org }
        ]
      })

      const section = await SectionEntity.findOne({
        where: [
          { id: organizationVersion.sectionId }
        ]
      })

      const user = await UsersEntity.findOne({
        where: [
          { id: organizationVersion.userId }
        ]
      })

      if (CheckOrganizationStatus.Accept) {
        organization.status = OrganizationStatus.Accepted
        organizationVersion.status = OrganizationStatus.Accepted

        organization.organization_name = organizationVersion.organization_name
        organization.main_organization = organizationVersion.main_organization
        organization.manager = organizationVersion.manager
        organization.email = organizationVersion.email
        organization.address = organizationVersion.address
        organization.scheduler = organizationVersion.scheduler
        organization.payment_types = organizationVersion.payment_types
        organization.transport = organizationVersion.transport
        organization.comment = organizationVersion.comment
        organization.location = organizationVersion.location
        organization.segment = organizationVersion.segment
        organization.account = organizationVersion.account
        organization.added_by = organizationVersion.added_by
        organization.inn = organizationVersion.inn
        organization.bank_account = organizationVersion.bank_account
        organization.common_rate = organizationVersion.common_rate
        organization.number_of_raters = organizationVersion.number_of_raters
        organization.status = organizationVersion.status
        organization.sub_category_org = subCategoryOrg
        organization.sectionId = section
        organization.userId = user

        phones.number = phonesVersion.number
        phones.type_number = phonesVersion.type_number

        pictures.image_link = picturesVersion.image_link

        OrganizationEntity.save(organization)
        OrganizationVersionsEntity.save(organizationVersion)
        PhoneOrganizationEntity.save(phones)
        PictureOrganizationEntity.save(pictures)
      }

      if (CheckOrganizationStatus.Reject) {
        organizationVersion.status = OrganizationStatus.Rejected

        if (organization.status == OrganizationStatus.Check) {
          organization.status = OrganizationStatus.Rejected
        }
      }

      return;
      /****************************************************************

      // find organization


      // find organization
      const findOrganizationResult: OrganizationEntity | undefined =
        await OrganizationEntity.findOne({
          where: [
            {
              id: organizationId,
            },
          ],
        });

      if (findOrganizationResult) {
        this.logger.debug(
          `Method: ${methodName} - Organization Not Found: `,
          findOrganizationResult
        );
        throw new HttpException('Organization Not Found', HttpStatus.NOT_FOUND);
      }

      // check organization status
      if (status == CheckOrganizationStatus.Accept) {
        // update organization if req.status accept
        const updateOrganizationResult: UpdateResult =
          await OrganizationEntity.update(organizationId, {
            status: OrganizationStatus.Accepted,
            update_date: formattedDate,
          });

        this.logger.debug(
          `Method: ${methodName} - updateOrganizationResult:`,
          updateOrganizationResult
        );

        return updateOrganizationResult;
      }

      // insert organisation version if req.status reject
      const organizationVersionResult: InsertResult =
        await OrganizationVersionsEntity.createQueryBuilder()
          .insert()
          .into(OrganizationVersionsEntity)
          .values({
            organization_id: findOrganizationResult.id,
            organization_name: findOrganizationResult.organization_name,
            main_organization: findOrganizationResult.main_organization,
            manager: findOrganizationResult.manager,
            email: findOrganizationResult.email,
            address: findOrganizationResult.address,
            scheduler: findOrganizationResult.scheduler,
            payment_types: findOrganizationResult.payment_types,
            transport: findOrganizationResult.transport,
            comment: findOrganizationResult.comment,
            location: findOrganizationResult.location,
            segment: findOrganizationResult.segment,
            account: findOrganizationResult.account,
            added_by: findOrganizationResult.added_by,
            inn: findOrganizationResult.inn,
            bank_account: findOrganizationResult.bank_account,
            common_rate: findOrganizationResult.common_rate,
            number_of_raters: findOrganizationResult.number_of_raters,
            status: findOrganizationResult.status,
            sub_category_org: findOrganizationResult.sub_category_org.toString(),
            sectionId: findOrganizationResult.sectionId.toString(),
            userId: findOrganizationResult.userId.toString(),
          })
          .execute();

      this.logger.debug(
        `Method: ${methodName} - organizationVersionResult:`,
        organizationVersionResult
      );

      if (!organizationVersionResult.identifiers[0].id) {
        this.logger.debug(
          `Method: ${methodName} - organizationVersion insert error:`,
          organizationVersionResult
        );
        throw new HttpException(
          `Error in inserting to organization version`,
          HttpStatus.BAD_REQUEST
        );
      }

      // find picture by organization id
      const findPicturesResult = await PictureOrganizationEntity.find({
        where: [
          {
            id: findOrganizationResult.id,
          },
        ],
      });

      if (!findPicturesResult) {
        this.logger.debug(
          `Method: ${methodName} - Pictures Not Found: `,
          findPicturesResult
        );
        throw new HttpException('Pictures Not Found', HttpStatus.NOT_FOUND);
      }

      // insert picture to version
      for (let i = 0; i < findPicturesResult.length; i++) {
        const insertPictureVersionResult =
          await PictureOrganizationVersionsEntity.createQueryBuilder()
            .insert()
            .into(PictureOrganizationVersionsEntity)
            .values({
              image_link: findPicturesResult[i].image_link,
              organization_id: organizationVersionResult.identifiers[0].id,
            })
            .execute();

        this.logger.debug(
          `Method: ${methodName} - insertPictureVersionResult:`,
          insertPictureVersionResult
        );

        if (!insertPictureVersionResult.identifiers[0].id) {
          this.logger.debug(
            `Method: ${methodName} - insertPictureVersionResult Insert Error:`,
            insertPictureVersionResult
          );
          throw new HttpException(
            `Error in inserting to Picture Version`,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      // find phone by organization id
      const findPhonesResult = await PhoneOrganizationEntity.find({
        where: [
          {
            id: findOrganizationResult.id,
          },
        ],
      });

      if (!findPhonesResult) {
        this.logger.debug(
          `Method: ${methodName} - Phones Not Found: `,
          findPhonesResult
        );
        throw new HttpException('Phones Not Found', HttpStatus.NOT_FOUND);
      }

      // inserting phones to version
      for (let i = 0; i < findPhonesResult.length; i++) {
        const insertPhoneVersionResult =
          await Phone_Organization_Versions_Entity.createQueryBuilder()
            .insert()
            .into(Phone_Organization_Versions_Entity)
            .values({
              number: findPhonesResult[i].number,
              type_number: findPhonesResult[i].type_number,
              organization: organizationVersionResult.identifiers[0].id,
            })
            .execute();

        this.logger.debug(
          `Method: ${methodName} - insertPhoneVersionResult:`,
          insertPhoneVersionResult
        );

        if (!insertPhoneVersionResult.identifiers[0].id) {
          this.logger.debug(
            `Method: ${methodName} - insertPhoneVersionResult Insert Error:`,
            insertPhoneVersionResult
          );
          throw new HttpException(
            `Error in inserting to Phone Version`,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      // update organization status if req.status reject
      const updateOrganizationStatusResult: UpdateResult =
        await OrganizationEntity.update(organizationId, {
          status: OrganizationStatus.Rejected,
          is_versioned: true,
          update_date: formattedDate,
        });

      this.logger.debug(
        `Method: ${methodName} - updateOrganizationStatusResult:`,
        updateOrganizationStatusResult
      );

      return updateOrganizationStatusResult;
      */
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error trace: `, error.trace);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
