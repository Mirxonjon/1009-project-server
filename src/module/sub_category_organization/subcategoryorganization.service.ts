import { HttpException, HttpStatus, Injectable, Body, Logger } from '@nestjs/common';
import { CreateSubCategoryOrganizationDto } from './dto/create_subcategoryorganization.dto';

import { UpdateSubCategoryOrganizationDto } from './dto/update_subcategoryorganization.dto';

import { SubCategoryOrgEntity } from 'src/entities/sub_category_org.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { GetAllSubCategoriesDto } from './dto/get_all_sub_categories.dto';
import { ILike } from 'typeorm';

@Injectable()
export class SubCategoryOrganizationServise {
  private logger = new Logger(SubCategoryOrganizationServise.name);

  async findAll(params: GetAllSubCategoriesDto) {
    const methodName = this.findAll.name;
    const { page, pageSize, all, search, } = params;

    if (all == 'true') {
      const [result, total] =
        await SubCategoryOrgEntity.findAndCount(
          {
            where: {
              title: search == 'null' ? null : ILike(`%${search}%`)
            }
          }
        ).catch((e) => {
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });

      if (!result) {
        this.logger.debug(
          `Method: ${methodName} - Categories Not Found: `,
          result
        );
        throw new HttpException('Categories Not Found', HttpStatus.NOT_FOUND);
      }
      // return findAllSegment;
      return {
        result,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 'all',
          totalItems: total,
        },
      };
    } else {
      const offset = (+page - 1) * +pageSize;
      const [result, total] = await SubCategoryOrgEntity.findAndCount({
        where: {
          title: search == 'null' ? null : ILike(`%${search}%`)
        },
        skip: offset,
        take: pageSize
      })

      if (!result) {
        this.logger.debug(
          `Method: ${methodName} - Segment Not Found: `,
          result
        );
        throw new HttpException('Not found Segment', HttpStatus.NOT_FOUND);
      }
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
    const findOne = await SubCategoryOrgEntity.find({
      where: {
        id,
      },
      relations: {
        organizations: true,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findOne;
  }

  async create(body: CreateSubCategoryOrganizationDto) {
    const findCategory = await CategoryOrganizationEntity.findOne({
      where: {
        id: body.category_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException(' Category not found', HttpStatus.NOT_FOUND);
    }

    await SubCategoryOrgEntity.createQueryBuilder()
      .insert()
      .into(SubCategoryOrgEntity)
      .values({
        title: body.title,
        category_org: findCategory,
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
  }
  async update(id: string, body: UpdateSubCategoryOrganizationDto) {
    const findSubCategoryOrg = await SubCategoryOrgEntity.findOne({
      where: { id },
    });

    if (!findSubCategoryOrg) {
      throw new HttpException('Sub Category not found', HttpStatus.NOT_FOUND);
    }
    let findCategory: CategoryOrganizationEntity | null = null;
    if (body.category_id) {
      findCategory = await CategoryOrganizationEntity.findOneBy({ id }).catch(
        (e) => {
          throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
        }
      );
      if (!findCategory) {
        throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
      }
    }

    const updatedVideo = await SubCategoryOrgEntity.update(id, {
      title: body.title.toLowerCase() || findSubCategoryOrg.title,

      category_org: findCategory,
    });

    return updatedVideo;
  }

  async remove(id: string) {
    const findSubCatgory = await SubCategoryOrgEntity.findOneBy({
      id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findSubCatgory) {
      throw new HttpException('Sub Catgeory not found', HttpStatus.NOT_FOUND);
    }

    await SubCategoryOrgEntity.delete({ id });
  }
}
