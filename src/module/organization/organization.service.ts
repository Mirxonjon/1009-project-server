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
  ActionEnum,
  RolesEnum,
  TNumbers,
  UserType,
  OrganizationStatus,
  checkOrganizationType,
  CheckOrganizationStatus,
  OrganizationStatusType,
  OrganizationVersionActionsEnum,
  GetTopTenOrganizatrionStatus,
} from 'src/types';
import {
  DeleteResult,
  In,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { OrganizationVersionsEntity } from 'src/entities/organization_versions.entity';
import { CheckOrganizationDto } from './dto/check_organization.dto';
import { PictureOrganizationVersionsEntity } from 'src/entities/picture_organization_versions.entity';
import { Phone_Organization_Versions_Entity } from 'src/entities/phone_organizations_versions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { SectionEntity } from 'src/entities/section.entity';
import { Not } from 'typeorm';
import { GetAllOrganizationsDto } from './dto/get_all_organization.dto';

@Injectable()
export class OrganizationServise {
  private logger = new Logger(OrganizationServise.name);

  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>
  ) { }

  async findAll(query: GetAllOrganizationsDto) {
    const { page, pageSize, search, name, category, subCategory, section, mainOrganization, segment, isTopTenList } =
      query;

    const queryBuilder = this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.phones', 'phones')
      .leftJoinAndSelect('organization.pictures', 'pictures')
      .leftJoinAndSelect('organization.sectionId', 'section')
      .leftJoinAndSelect(
        'organization.saved_organization',
        'saved_organization'
      )
      .leftJoinAndSelect('organization.comments', 'comments')
      .leftJoinAndSelect('organization.sub_category_org', 'subCategory')
      .leftJoinAndSelect('subCategory.category_org', 'category');

    let topTenList;

    if (search) {
      queryBuilder.andWhere('organization.organization_name LIKE :search', {
        search: `%${search}%`,
      });


      if (isTopTenList == GetTopTenOrganizatrionStatus.True) {
        const queryBuilder = this.organizationRepository
          .createQueryBuilder('organization')

        queryBuilder.andWhere(
          `
            organization.organization_name LIKE :search
            AND status = :status
            ORDER BY created_at DESC LIMIT :limit
          `,
          {
            search: `%${search}%`,
            limit: 10,
            status: OrganizationStatus.Accepted
          }
        );

        const topTenOrganizations = await queryBuilder.getMany()

        topTenList = topTenOrganizations.map(({ id, organization_name, address }) => ({ id, organization_name, address }));
      }


    }

    if (name) {
      queryBuilder.andWhere('organization.organization_name LIKE :name', { name });
    }

    if (category) {
      queryBuilder.andWhere('category.id = :category', { category });
    }

    if (subCategory) {
      queryBuilder.andWhere('subCategory.id = :subCategory', {
        subCategory,
      });
    }

    if (section) {
      queryBuilder.andWhere('section.id = :section', { section });
    }

    if (mainOrganization) {
      queryBuilder.andWhere('organization.main_organization = :mainOrganization', { mainOrganization });
    }

    queryBuilder.andWhere('status = :status', { status: OrganizationStatus.Accepted })
    queryBuilder.orderBy('organization.create_data', 'DESC');

    const offset = (page - 1) * pageSize;
    queryBuilder.skip(offset).take(pageSize);

    const [result, totalItems] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalItems / pageSize);

    // Create a map to group subcategories by category
    const formattedData = [];

    for (const org of result) {
      const categoryName = org?.sub_category_org?.category_org?.title;
      const categoryId = org?.sub_category_org?.category_org?.id;
      const subCategoryName = org?.sub_category_org?.title;
      const subCategoryId = org?.sub_category_org?.id;

      // Skip the iteration if categoryName or subCategoryName is undefined
      if (!categoryName || !subCategoryName) {
        continue;
      }

      let categoryObj = formattedData.find(item => item.category === categoryName);
      if (!categoryObj) {
        categoryObj = {
          category: categoryName,
          category_id: categoryId,
          sub_categories: []
        };
        formattedData.push(categoryObj);
      }

      const organizationsGetCountValues = {
        subCatId: subCategoryId,
        categoryId: categoryId,
        status: OrganizationStatus.Accepted
      }

      // Fetch the organization count from the database
      const organizationsCount = await this.organizationRepository
        .createQueryBuilder("organization")
        .leftJoinAndSelect('organization.phones', 'phones')
        .leftJoinAndSelect('organization.pictures', 'pictures')
        .leftJoinAndSelect('organization.sectionId', 'section')
        .leftJoinAndSelect(
          'organization.saved_organization',
          'saved_organization'
        )
        .leftJoinAndSelect('organization.comments', 'comments')
        .leftJoinAndSelect('organization.sub_category_org', 'subCategory')
        .leftJoinAndSelect('subCategory.category_org', 'category')
        .where(
          `
            organization.subCategoryOrgId = :subCatId
            AND category.id = :categoryId
            AND organization.status = :status
          `,
          organizationsGetCountValues
        );

      if (name) {
        organizationsCount.andWhere('organization.organization_name = :name', { name });
      }

      if (category) {
        organizationsCount.andWhere('category.id = :category', { category });
      }

      if (subCategory) {
        organizationsCount.andWhere('subCategory.id = :subCategory', {
          subCategory,
        });
      }

      if (section) {
        organizationsCount.andWhere('section.id = :section', { section });
      }

      if (mainOrganization) {
        organizationsCount.andWhere('organization.main_organization = :mainOrganization', { mainOrganization });
      }

      const getOrgCount = await organizationsCount.getCount();

      let subCategoryObj = categoryObj.sub_categories.find(sub => sub.name === subCategoryName);
      if (!subCategoryObj) {
        subCategoryObj = {
          name: subCategoryName,
          id: subCategoryId,
          count: getOrgCount
        };
        categoryObj.sub_categories.push(subCategoryObj);
      }
    }

    return {
      result: {
        organizations: result,
        categories: formattedData,
        top_tent_list: topTenList
      },
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems,
      },
    };
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
            id: user.userId,
          },
          status: OrganizationStatus.Accepted ,
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
            id: user.userId,
          },
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

  async findMyOrganizationUpdateOrDelete(
    user: UserType,
    page: string,
    pageSize: string
  ) {
    console.log(page,pageSize);
    
    if (pageSize == 'all') {
      const [result, total] = await OrganizationVersionsEntity.findAndCount({
        where: {
          organization_id: {
            userId: {
              id: user.userId,
            },
          },
          method: In([
            OrganizationVersionActionsEnum.CREATE,
            OrganizationVersionActionsEnum.UPDATE,
            OrganizationVersionActionsEnum.DELETE,
          ]),
        },
        relations: {
          phones: true,
          pictures: true,
          organization_id: {
            sub_category_org: {
              category_org: true,
            },
          },

          // saved_organization: true,
          // comments: true,/
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
          pageSize: total,
          totalItems: total,
        },
      };
    } else {
      const offset = (+page - 1) * +pageSize;

      const [result, total] = await OrganizationVersionsEntity.findAndCount({
        where: {
          organization_id: {
            userId: {
              id: user.userId,
            },
          },
          method: In([
            OrganizationVersionActionsEnum.CREATE,
            OrganizationVersionActionsEnum.UPDATE,
            OrganizationVersionActionsEnum.DELETE,
          ]),
        },
        relations: {
          phones: true,
          pictures: true,
          organization_id: {
            sub_category_org: {
              category_org: true,
            },
          },

          // saved_organization: true,
          // comments: true,/
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

  async create(
    user: UserType,
    body: CreateOrganizationDto,
    pictures: Array<Express.Multer.File>
  ) {
    this.logger.debug(body, 'BODY');
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
    console.log(user, 'Role');

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
      let phones = JSON.parse(body.phones as any);

      console.log(phones, 'PHONES in IF');
      // for (let i = 0; i < phones?.length; i++) {
      //   await PhoneOrganizationEntity.createQueryBuilder()
      //   .insert()
      //   .into(PhoneOrganizationEntity)
      //   .values({
      //     number: phones[i].number,
      //     type_number: phones[i].type_number,
      //     organization: {
      //       id: createdOrg.raw[0].id,
      //     },
      //   })
      //   .execute()
      //   .catch((e) => {
      //     console.log(e, ': PHONE CREATE');
      //     throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      //   });

      // }

      console.log(phones, 'PHONES ORG');

      const numbers = phones?.numbers;
      for (let i = 0; i < numbers?.length; i++) {
        this.logger.debug('Phones Create before', numbers);

        await PhoneOrganizationEntity.createQueryBuilder()
          .insert()
          .into(PhoneOrganizationEntity)
          .values({
            number: numbers[i].number,
            type_number: numbers[i].type_number,
            organization: {
              id: createdOrg.raw[0].id,
            },
          })
          .execute()
          .catch((e) => {
            console.log(e, ': PHONE CREATE');
            throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
          });

        this.logger.debug('Phones Create after', numbers);
      }

      // phones?.numbers?.forEach(
      //   async (e: { number: string; type_number: string }) => {
      //     await PhoneOrganizationEntity.createQueryBuilder()
      //       .insert()
      //       .into(PhoneOrganizationEntity)
      //       .values({
      //         number: e.number,
      //         type_number: e.type_number,
      //         organization: {
      //           id: createdOrg.raw[0].id,
      //         },
      //       })
      //       .execute()
      //       .catch((e) => {
      //         console.log(e, ': PHONE CREATE');
      //         throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      //       });
      //   }
      // );

      console.log(phones, 'AFTER INSERT PHONES');
      console.log(pictures, ' INSERT picture');

      console.log(pictures, 'PICTURES ORG');
      for (let i = 0; i < pictures?.length; i++) {
        const formatImage = extname(pictures[i]?.originalname).toLowerCase();
        if (allowedImageFormats.includes(formatImage)) {
          console.log('PICTURES LOG');
          const linkImage: string = await googleCloudAsync(pictures[i]);
          console.log(linkImage, 'LINK IMAGE');

          await PictureOrganizationEntity.createQueryBuilder()
            .insert()
            .into(PictureOrganizationEntity)
            .values({
              image_link: linkImage,
              // action: ActionEnum.create,
              organization_id: {
                id: createdOrg.raw[0].id,
              },
            })
            .execute()
            .catch((e) => {
              console.log(e, 'ERROR IN INSERTING PICTURE');
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
        }
      }
      console.log(createdOrg.identifiers[0].id, 'CREATED ORG ID');

      await this.createOrgVersion(createdOrg.identifiers[0].id, user);

      console.log(pictures, 'AFTER INSERT FILES');
      return;
    }
  }

  async createOrgVersion(
    organizationId: string,
    user: UserType
  ): Promise<string> {
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

      if (!findOrganizationResult) {
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
            organization_id: {
              id: findOrganizationResult.id,
            },
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
            method:
              user.role == RolesEnum.SUPERADMIN
                ? OrganizationVersionActionsEnum.DONE
                : OrganizationVersionActionsEnum.CREATE,
            sub_category_org:
              findOrganizationResult.sub_category_org?.toString(),
            sectionId: findOrganizationResult.sectionId?.toString(),
            userId: findOrganizationResult.userId?.toString(),
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
              id: findPhonesResult[i].id,
              // phone_id: findPhonesResult[i].id,
              number: findPhonesResult[i].number,
              type_number: findPhonesResult[i].type_number,
              action: ActionEnum.done,
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
            organization_id: { id: findOrganizationResult.id },
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
      console.log(findPicturesResult, 'Version find Picture');

      // insert picture to version
      for (let i = 0; i < findPicturesResult.length; i++) {
        const insertPictureVersionResult =
          await PictureOrganizationVersionsEntity.createQueryBuilder()
            .insert()
            .into(PictureOrganizationVersionsEntity)
            .values({
              id: findPicturesResult[i].id,
              // picture_id: findPicturesResult[i].id,

              action: ActionEnum.done,
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



  async updateOrg(organizationVersionId: string) {
    const methodName = this.updateOrg.name;

    try {
      const findOrganizationVersionResult:
        | OrganizationVersionsEntity
        | undefined = await OrganizationVersionsEntity.findOne({
          where: [
            {
              id: organizationVersionId,
            },
          ],
          relations: {
            organization_id: true,
          },
        });

      const updateOrganizationEntityResult: UpdateResult =
        await OrganizationEntity.createQueryBuilder()
          .update(OrganizationEntity)
          .set({
            organization_name: findOrganizationVersionResult.organization_name,
            main_organization: findOrganizationVersionResult.main_organization,
            manager: findOrganizationVersionResult.manager,
            email: findOrganizationVersionResult.email,
            address: findOrganizationVersionResult.address,
            scheduler: findOrganizationVersionResult.scheduler,
            payment_types: findOrganizationVersionResult.payment_types,
            transport: findOrganizationVersionResult.transport,
            comment: findOrganizationVersionResult.comment,
            location: findOrganizationVersionResult.location,
            segment: findOrganizationVersionResult.segment,
            account: findOrganizationVersionResult.account,
            added_by: findOrganizationVersionResult.added_by,
            inn: findOrganizationVersionResult.inn,
            bank_account: findOrganizationVersionResult.bank_account,
            common_rate: findOrganizationVersionResult.common_rate,
            number_of_raters: findOrganizationVersionResult.number_of_raters,
            status: OrganizationStatus.Accepted,
            sub_category_org: {
              id: findOrganizationVersionResult.sub_category_org,
            },
            sectionId: {
              id: findOrganizationVersionResult.sectionId,
            },
          })
          .where('id = :id', {
            id: findOrganizationVersionResult.organization_id.id,
          })
          .execute();

      this.logger.debug(
        `Method: ${methodName} - organizationVersionResult:`,
        updateOrganizationEntityResult
      );
      console.log(
        updateOrganizationEntityResult,
        'Update OrganizationEntityResult'
      );

      if (!updateOrganizationEntityResult.affected) {
        this.logger.debug(
          `Method: ${methodName} - organizationVersion update error:`,
          updateOrganizationEntityResult
        );
        throw new HttpException(
          `Error in update to organization version`,
          HttpStatus.BAD_REQUEST
        );
      }

      const findPhonesOrganizationVersion =
        await Phone_Organization_Versions_Entity.find({
          where: { organization: { id: findOrganizationVersionResult.id } },
          relations: {
            organization: {
              organization_id: true,
            },
          },
        });
      console.log(
        findPhonesOrganizationVersion,
        'findPhones Organization Version'
      );

      for (let i = 0; i < findPhonesOrganizationVersion.length; i++) {
        console.log(
          findPhonesOrganizationVersion[i].action,
          'findPhone  Organization Version'
        );

        if (findPhonesOrganizationVersion[i].action == ActionEnum.create) {
          console.log(
            findPhonesOrganizationVersion[i],
            i,
            'findPhone  Organization Version'
          );
          const createPhoneResult: InsertResult =
            await PhoneOrganizationEntity.createQueryBuilder()
              .insert()
              .into(PhoneOrganizationEntity)
              .values({
                id: findPhonesOrganizationVersion[i].id,
                number: findPhonesOrganizationVersion[i].number,
                type_number: findPhonesOrganizationVersion[i].type_number,
                // action: ActionEnum.create,
                organization: {
                  id: findOrganizationVersionResult.organization_id.id,
                },
              })
              .execute()
              .catch((e) => {
                console.log(e);
                throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
              });
          console.log(createPhoneResult, 'createPhoneResult');

          if (!createPhoneResult.identifiers[0].id) {
            this.logger.debug(
              `Method: ${methodName} - phone insert error:`,
              createPhoneResult
            );
            throw new HttpException('phone insert error', HttpStatus.NOT_FOUND);
          }
          console.log('update');

          const updatePhoneVersionResult: UpdateResult =
            await Phone_Organization_Versions_Entity.update(
              findPhonesOrganizationVersion[i].id,
              {
                action: ActionEnum.done,
              }
            ).catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
          console.log('update last', findPhonesOrganizationVersion[i].id);
          if (!updatePhoneVersionResult.affected) {
            this.logger.debug(
              `Method: ${methodName} - Phone Version Update In Org Version To Org Error:`,
              updatePhoneVersionResult
            );
            throw new HttpException(
              'Phone Update Error',
              HttpStatus.BAD_REQUEST
            );
          }
        } else if (
          findPhonesOrganizationVersion[i].action == ActionEnum.update
        ) {
          const PhoneResult = await PhoneOrganizationEntity.findOne({
            where: {
              id: findPhonesOrganizationVersion[i].id,
            },
          });

          if (!PhoneResult) {
            this.logger.debug(
              `Method: ${methodName} - Not Found Number:`,
              PhoneResult
            );
            throw new HttpException('Not Found Number', HttpStatus.NOT_FOUND);
          }

          const updatePhoneResult: UpdateResult =
            await PhoneOrganizationEntity.update(
              PhoneResult.id,
              {
                number: findPhonesOrganizationVersion[i].number,
                type_number: findPhonesOrganizationVersion[i].type_number,
              }
            );

          if (!updatePhoneResult.affected) {
            this.logger.debug(
              `Method: ${methodName} - Phone Update Error:`,
              updatePhoneResult
            );
            throw new HttpException(
              'Phone Update Error',
              HttpStatus.BAD_REQUEST
            );
          }
          const updatePhoneVersionResult: UpdateResult =
            await Phone_Organization_Versions_Entity.update(
              findPhonesOrganizationVersion[i].id,
              {
                action: ActionEnum.done,
              }
            );

          if (!updatePhoneVersionResult.affected) {
            this.logger.debug(
              `Method: ${methodName} - Phone Version Update Error:`,
              updatePhoneVersionResult
            );
            throw new HttpException(
              'Phone Update Error',
              HttpStatus.BAD_REQUEST
            );
          }
        } else if (
          findPhonesOrganizationVersion[i].action == ActionEnum.delete
        ) {
          console.log(
            findPhonesOrganizationVersion[i].id,
            i,
            'findPhone  Organization Version delete'
          );

          const PhoneResult = await PhoneOrganizationEntity.findOne({
            where: {
              id: findPhonesOrganizationVersion[i]?.id,
            },
          }).catch((e) => {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
          });

          if (!PhoneResult) {
            this.logger.debug(
              `Method: ${methodName} - Not Found Number In Version:`,
              PhoneResult
            );
            throw new HttpException(
              'Not Found Number In Version',
              HttpStatus.NOT_FOUND
            );
          }

          const deletePhoneResult: DeleteResult =
            await PhoneOrganizationEntity.delete({
              id: PhoneResult.id,
            }).catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
          console.log(deletePhoneResult);
          console.log(findPhonesOrganizationVersion[i]?.id, PhoneResult?.id, 'Find Version');

          if (!deletePhoneResult.affected) {
            this.logger.debug(
              `Method: ${methodName} - Phone  Delete Error:`,
              deletePhoneResult
            );
            throw new HttpException(
              'Phone Delete Error',
              HttpStatus.BAD_REQUEST
            );
          }

          const deletePhoneVersionResult: DeleteResult =
            await Phone_Organization_Versions_Entity.delete({
              id: findPhonesOrganizationVersion[i].id,
            }).catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });

          if (deletePhoneVersionResult.affected == 0) {
            this.logger.debug(
              `Method: ${methodName} - Phone Version Delete Error:`,
              deletePhoneVersionResult
            );
            throw new HttpException(
              'Phone Delete Error',
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }

      const findPictureOrganizationVersion =
        await PictureOrganizationVersionsEntity.find({
          where: { organization_id: { id: findOrganizationVersionResult.id } },
          relations: {
            organization_id: {
              organization_id: true,
            },
          },
        });
      console.log(
        findPictureOrganizationVersion,
        findPictureOrganizationVersion.length,
        'find Picture Organization Version'
      );

      for (let i = 0; i < findPictureOrganizationVersion?.length; i++) {
        if (findPictureOrganizationVersion[i].action == ActionEnum.create) {
          // const linkImage: string = await googleCloudAsync(findPictureOrganizationVersion[i]);
          console.log(
            findPictureOrganizationVersion[i],
            i,
            'findPictureOrganizationVersion[i]'
          );

          const createPicture: InsertResult =
            await PictureOrganizationEntity.createQueryBuilder()
              .insert()
              .into(PictureOrganizationEntity)
              .values({
                id: findPictureOrganizationVersion[i].id,
                image_link: findPictureOrganizationVersion[i].image_link,
                organization_id: {
                  id: findOrganizationVersionResult.organization_id.id,
                },
              })
              .execute()
              .catch((e) => {
                console.log(e);
                throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
              });
          console.log(createPicture.identifiers);

          if (!createPicture.identifiers[0].id) {
            this.logger.debug(
              `Method: ${methodName} - picture version insert error:`,
              createPicture
            );
            throw new HttpException(
              ' picture versionerror',
              HttpStatus.NOT_FOUND
            );
          }

          const updatePhoneVersionResult: UpdateResult =
            await PictureOrganizationVersionsEntity.update(
              findPictureOrganizationVersion[i].id,
              {
                action: ActionEnum.done,
              }
            ).catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
          console.log('update last');
          if (!updatePhoneVersionResult.affected) {
            this.logger.debug(
              `Method: ${methodName} - Picture Version Update Error:`,
              updatePhoneVersionResult
            );
            throw new HttpException(
              'Phone Update Error',
              HttpStatus.BAD_REQUEST
            );
          }

          // const updatePictureVersionResult = await PictureOrganizationVersionsEntity.update(
          //   findPictureOrganizationVersion[i].id,
          //   {
          //     action : ActionEnum.done
          //   }
          // )

          // if (updatePictureVersionResult.affected == 0) {
          //   this.logger.debug(
          //     `Method: ${methodName} - Picture  Update Version Error:`,
          //     updatePictureVersionResult
          //   );
          //   throw new HttpException(
          //     'Phone Delete Error',
          //     HttpStatus.BAD_REQUEST
          //   );
          // }
        } else if (
          findPictureOrganizationVersion[i].action == ActionEnum.delete
        ) {
          console.log(findPictureOrganizationVersion[i].id, 'Idddddddd');

          const pictureResult = await PictureOrganizationEntity.findOne({
            where: {
              id: findPictureOrganizationVersion[i].id,
            },
          });

          if (!pictureResult) {
            this.logger.debug(
              `Method: ${methodName} - Not Found Picture 1 :`,
              pictureResult
            );
            throw new HttpException('Not Found Picture ', HttpStatus.NOT_FOUND);
          }

          await deleteFileCloud(pictureResult.image_link);

          const deletePictureResult: DeleteResult =
            await PictureOrganizationEntity.delete({
              id: findPictureOrganizationVersion[i].id,
            });

          if (deletePictureResult.affected == 0) {
            this.logger.debug(
              `Method: ${methodName} - Picture  Delete Error:`,
              deletePictureResult
            );
            throw new HttpException(
              'Phone Delete Error',
              HttpStatus.BAD_REQUEST
            );
          }

          const deletePictureVersionResult: DeleteResult =
            await PictureOrganizationVersionsEntity.delete({
              id: findPictureOrganizationVersion[i].id,
            });

          if (deletePictureVersionResult.affected == 0) {
            this.logger.debug(
              `Method: ${methodName} - Picture Version Delete Error:`,
              deletePictureVersionResult
            );
            throw new HttpException(
              'Phone Delete Error',
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }
      console.log('FINAL');
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error trace: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateOrgVersion(
    user: UserType,
    organizationId: string,
    body: UpdateOrganizationDto,
    pictures: Array<Express.Multer.File>
  ) {
    console.log('STATE');
    const methodName = this.updateOrgVersion.name;

    this.logger.debug(`Method: ${methodName} - Organization Request: `, {
      user,
      organizationId,
      body,
      pictures,
    });

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

      if (!findOrganizationResult) {
        this.logger.debug(
          `Method: ${methodName} - Organization Not Found: `,
          findOrganizationResult
        );
        throw new HttpException('Organization Not Found', HttpStatus.NOT_FOUND);
      }

      // console.log(findOrganizationResult, 'findOrganizationResult');
      const findOrganizationVersionResult:
        | OrganizationVersionsEntity
        | undefined = await OrganizationVersionsEntity.findOne({
          where: {
            organization_id: {
              id: findOrganizationResult.id,
            },
          },

          relations: {
            organization_id: true,
          },
        }).catch((e) => {
          console.log(e);
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });
      // console.log(findOrganizationVersionResult ,'find OrganizationVersion Result');

      if (!findOrganizationVersionResult) {
        this.logger.debug(
          `Method: ${methodName} - Organization Version Not Found: `,
          findOrganizationVersionResult
        );
        throw new HttpException(
          'Organization Version Not Found',
          HttpStatus.NOT_FOUND
        );
      }

      let findSubCategory = findOrganizationResult?.sub_category_org;

      if (body.sub_category_id != 'null') {
        findSubCategory = await SubCategoryOrgEntity.findOne({
          where: {
            id: body.sub_category_id,
          },
        });

        if (!findSubCategory) {
          this.logger.debug(
            `Method: ${methodName} - Sub Category Not Found: `,
            findSubCategory
          );
          throw new HttpException(
            'Sub Category Not Found',
            HttpStatus.NOT_FOUND
          );
        }
      }

      let findSection = findOrganizationResult?.sectionId;

      if (body.section != 'null') {
        findSection = await SectionEntity.findOne({
          where: {
            id: body.section,
          },
        });
        if (!findSection) {
          this.logger.debug(
            `Method: ${methodName} - Section Not Found: `,
            findSection
          );
          throw new HttpException('Section Not Found', HttpStatus.NOT_FOUND);
        }
      }

      // update organization version

      const updateOrganizationVersionResult: UpdateResult =
        await OrganizationVersionsEntity.createQueryBuilder()
          .update(OrganizationVersionsEntity)
          .set({
            organization_name:
              body.organization_name ||
              findOrganizationResult.organization_name,
            main_organization:
              body.main_organization ||
              findOrganizationResult.main_organization,
            manager: body.manager || findOrganizationResult.manager,
            email: body.email || findOrganizationResult.email,
            address: body.address || findOrganizationResult.address,
            scheduler:
              JSON.parse(body.scheduler as any) ||
              findOrganizationResult.scheduler,
            payment_types:
              JSON.parse(body.payment_types as any) ||
              findOrganizationResult.payment_types,
            transport:
              JSON.parse(body.transport as any) ||
              findOrganizationResult.transport,
            comment: body.comment || findOrganizationResult.comment,
            location:
              JSON.parse(body.location as any) ||
              findOrganizationResult.location,
            segment: body.segment || findOrganizationResult.segment,
            account: body.account || findOrganizationResult.account,
            added_by: body.added_by || findOrganizationResult.added_by,
            inn: body.inn || findOrganizationResult.inn,
            bank_account:
              body.bank_account || findOrganizationResult.bank_account,
            common_rate: findOrganizationResult.common_rate,
            number_of_raters: findOrganizationResult.number_of_raters,
            status:
              user.role == RolesEnum.SUPERADMIN
                ? OrganizationStatus.Accepted
                : OrganizationStatus.Check,
            sub_category_org: findSubCategory?.id?.toString(),
            sectionId: findSection?.id?.toString(),
            method:
              user.role == RolesEnum.SUPERADMIN
                ? OrganizationVersionActionsEnum.DONE
                : OrganizationVersionActionsEnum.UPDATE,
            // userId: findOrganizationResult.userId.toString(),
          })
          .where(' id = :id', { id: findOrganizationVersionResult.id })
          .execute()
          .catch((e) => {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
          });

      // this.logger.debug(
      //   `Method: ${methodName} - organizationVersionResult:`,
      //   updateOrganizationVersionResult
      // );
      console.log(
        updateOrganizationVersionResult,
        'updateOrganizationVersionResult'
      );

      if (!updateOrganizationVersionResult.affected) {
        this.logger.debug(
          `Method: ${methodName} - organizationVersion update error:`,
          updateOrganizationVersionResult
        );
        throw new HttpException(
          `Error in update to organization version`,
          HttpStatus.BAD_REQUEST
        );
      }

      let PhonesObject = JSON.parse(body.phones as any);
      let allPhones = PhonesObject.numbers;

      for (let i = 0; i < allPhones.length; i++) {
        console.log(allPhones[i], 'allPhones', allPhones);

        if (allPhones[i].action == ActionEnum.create) {
          const createPhoneVersionResult: InsertResult =
            await Phone_Organization_Versions_Entity.createQueryBuilder()
              .insert()
              .into(Phone_Organization_Versions_Entity)
              .values({
                number: allPhones[i].number,
                type_number: allPhones[i].type_number,
                action: ActionEnum.create,
                organization: {
                  id: findOrganizationVersionResult.id,
                },
              })
              .execute()
              .catch((e) => {
                console.log(e);
                throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
              });
          console.log(createPhoneVersionResult, 'createPhoneVersionResult');

          if (!createPhoneVersionResult.identifiers[0].id) {
            this.logger.debug(
              `Method: ${methodName} - phone insert error:`,
              createPhoneVersionResult
            );
            throw new HttpException('phone insert error', HttpStatus.NOT_FOUND);
          }
        } else if (allPhones[i].action == ActionEnum.update) {
          const PhoneVersionResult =
            await Phone_Organization_Versions_Entity.findOne({
              where: {
                id: allPhones[i].id,
              },
            });

          if (!PhoneVersionResult) {
            this.logger.debug(
              `Method: ${methodName} - Not Found Number In Version:`,
              PhoneVersionResult
            );
            throw new HttpException(
              'Not Found Number In Version',
              HttpStatus.NOT_FOUND
            );
          }
          const updatePhoneVersionResult: UpdateResult =
            await Phone_Organization_Versions_Entity.update(allPhones[i].id, {
              number: allPhones[i].number,
              type_number: allPhones[i].type_number,
              action: ActionEnum.update,
            });

          if (!updatePhoneVersionResult.affected) {
            this.logger.debug(
              `Method: ${methodName} - Phone Version Update Error:`,
              updatePhoneVersionResult
            );
            throw new HttpException(
              'Phone Update Error',
              HttpStatus.BAD_REQUEST
            );
          }
        } else if (allPhones[i].action == ActionEnum.delete) {
          const PhoneVersionResult =
            await Phone_Organization_Versions_Entity.findOne({
              where: {
                id: allPhones[i].id,
              },
            });

          if (!PhoneVersionResult) {
            this.logger.debug(
              `Method: ${methodName} - Not Found Number In Version:`,
              PhoneVersionResult
            );
            throw new HttpException(
              'Not Found Number In Version',
              HttpStatus.NOT_FOUND
            );
          }

          const updatePhoneVersionResult: UpdateResult =
            await Phone_Organization_Versions_Entity.update(allPhones[i].id, {
              number: allPhones[i].number,
              type_number: allPhones[i].type_number,
              action: ActionEnum.delete,
            });
          // const updatePhoneVersionResult: UpdateResult =
          // await Phone_Organization_Versions_Entity.update(allPhones[i].id, {
          //   number: allPhones[i].number,
          //   type_number: allPhones[i].type_number,
          //   action: ActionEnum.update,
          // });

          if (!updatePhoneVersionResult.affected) {
            this.logger.debug(
              `Method: ${methodName} - Phone Version Update action to delete Error:`,
              updatePhoneVersionResult
            );
            throw new HttpException(
              'Phone Update Error',
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }

      for (let i = 0; i < pictures?.length; i++) {
        const formatImage = extname(pictures[i]?.originalname).toLowerCase();
        if (allowedImageFormats.includes(formatImage)) {
          const linkImage: string = await googleCloudAsync(pictures[i]);

          await PictureOrganizationVersionsEntity.createQueryBuilder()
            .insert()
            .into(PictureOrganizationVersionsEntity)
            .values({
              image_link: linkImage,
              action: ActionEnum.create,
              organization_id: {
                id: findOrganizationVersionResult.id,
              },
            })
            .execute()
            .catch((e) => {
              console.log(e);
              throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
            });
        }
      }

      let pictures_delete = JSON.parse(body.pictures_delete as any);
      console.log(pictures_delete, 'pictures_delete');

      let AllPictureDelete =
        pictures_delete.delete.length > 0 ? pictures_delete.delete : 0;
      for (let i = 0; i < AllPictureDelete.length; i++) {
        const findPicture = await PictureOrganizationVersionsEntity.findOne({
          where: {
            id: AllPictureDelete[i],
          },
        });
        console.log(findPicture, 'FIND PICTURE IN LOOP');

        if (!findPicture) {
          this.logger.debug(
            `Method: ${methodName} - Not found picture 2 :`,
            findPicture
          );
          throw new HttpException('Not found picture', HttpStatus.NOT_FOUND);
        }
        // await deleteFileCloud(findPicture.image_link);

        const updatePictureVersionResult: UpdateResult =
          await PictureOrganizationVersionsEntity.update(findPicture.id, {
            image_link: findPicture.image_link,
            action: ActionEnum.delete,
          });

        if (!updatePictureVersionResult.affected) {
          this.logger.debug(
            `Method: ${methodName} - Picture Delete Error:`,
            updatePictureVersionResult
          );
        }
      }

      if (user.role == RolesEnum.SUPERADMIN) {
        this.updateOrg(findOrganizationVersionResult.id);
      }
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error trace: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async check(organizationId: string, status: checkOrganizationType) {
    const methodName = this.check.name;
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    try {
      const organizationVersion = await OrganizationVersionsEntity.findOne({
        where: [
          {
            organization_id: {
              id: organizationId,
            },
          },
        ],
      });

      const organization = await OrganizationEntity.findOne({
        where: [{ id: organizationId }],
      });

      const phones = await PhoneOrganizationEntity.findOne({
        where: [{ organization: { id: organization.id } }],
      });

      const phonesVersion = await Phone_Organization_Versions_Entity.findOne({
        where: [{ organization: { id: organization.id } }],
      });

      const pictures = await PictureOrganizationEntity.findOne({
        where: [{ organization_id: { id: organization.id } }],
      });

      const picturesVersion = await PictureOrganizationVersionsEntity.findOne({
        where: [{ organization_id: { id: organization.id } }],
      });

      const subCategoryOrg = await SubCategoryOrgEntity.findOne({
        where: [{ id: organizationVersion.sub_category_org }],
      });

      const section = await SectionEntity.findOne({
        where: [{ id: organizationVersion.sectionId }],
      });

      const user = await UsersEntity.findOne({
        where: [{ id: organizationVersion.userId }],
      });

      if (CheckOrganizationStatus.Accept) {
        organization.status = OrganizationStatus.Accepted;
        organizationVersion.status = OrganizationStatus.Accepted;

        organization.organization_name = organizationVersion.organization_name;
        organization.main_organization = organizationVersion.main_organization;
        organization.manager = organizationVersion.manager;
        organization.email = organizationVersion.email;
        organization.address = organizationVersion.address;
        organization.scheduler = organizationVersion.scheduler;
        organization.payment_types = organizationVersion.payment_types;
        organization.transport = organizationVersion.transport;
        organization.comment = organizationVersion.comment;
        organization.location = organizationVersion.location;
        organization.segment = organizationVersion.segment;
        organization.account = organizationVersion.account;
        organization.added_by = organizationVersion.added_by;
        organization.inn = organizationVersion.inn;
        organization.bank_account = organizationVersion.bank_account;
        organization.common_rate = organizationVersion.common_rate;
        organization.number_of_raters = organizationVersion.number_of_raters;
        organization.status = organizationVersion.status;
        organization.sub_category_org = subCategoryOrg;
        organization.sectionId = section;
        organization.userId = user;

        phones.number = phonesVersion.number;
        phones.type_number = phonesVersion.type_number;

        pictures.image_link = picturesVersion.image_link;

        OrganizationEntity.save(organization);
        OrganizationVersionsEntity.save(organizationVersion);
        PhoneOrganizationEntity.save(phones);
        PictureOrganizationEntity.save(pictures);
      }

      if (CheckOrganizationStatus.Reject) {
        organizationVersion.status = OrganizationStatus.Rejected;

        if (organization.status == OrganizationStatus.Check) {
          organization.status = OrganizationStatus.Rejected;
          OrganizationEntity.save(organization);
        }
        OrganizationVersionsEntity.save(organizationVersion);
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
