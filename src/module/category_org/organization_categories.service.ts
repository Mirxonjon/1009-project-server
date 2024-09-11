import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationCategoryDto } from './dto/create_organization_categories.dto';
import { UpdateOrganizationCategoryDto } from './dto/update_organization_categories.dto';
import { ILike, Like } from 'typeorm';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { GetAllCategoriesDto } from './dto/get_all_categories.dto';
import { SegmentService } from '../segment/segment.service';
@Injectable()
export class OrganizationCategoriesService {
  private logger = new Logger(OrganizationCategoriesService.name);

  async findAll(params: GetAllCategoriesDto) {
    const methodName = this.findAll.name;
    const { page, pageSize, all, search, } = params;

    if (all == 'true') {
      const [result, total] =
        await CategoryOrganizationEntity.findAndCount(
          {
            where: {
              title: search == 'null' ? null : ILike(`%${search}%`)
            }
          }
        ).catch((e) => {
          console.log(e.message, 'ookkk');

          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
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
      const [result, total] = await CategoryOrganizationEntity.findAndCount({
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
    const findCategory: CategoryOrganizationEntity =
      await CategoryOrganizationEntity.findOne({
        where: {
          id: id,
        },
        relations: {
          sub_category_orgs: {
            organizations: true,
          },
        },
      });

    if (!findCategory) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return findCategory;
  }

  async create(body: CreateOrganizationCategoryDto) {
    const findCategory = await CategoryOrganizationEntity.findOneBy({
      title: body.title,
    });

    if (findCategory) {
      throw new HttpException(
        'Already created this category',
        HttpStatus.FOUND
      );
    }
    await CategoryOrganizationEntity.createQueryBuilder()
      .insert()
      .into(CategoryOrganizationEntity)
      .values({
        title: body.title.toLowerCase(),
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async update(id: string, body: UpdateOrganizationCategoryDto) {
    const findCategory = await CategoryOrganizationEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
    }

    await CategoryOrganizationEntity.createQueryBuilder()
      .update(CategoryOrganizationEntity)
      .set({
        title: body.title.toLowerCase() || findCategory.title,
      })
      .where({ id })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async remove(id: string) {
    const findCategory = await CategoryOrganizationEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Not found Category', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    await CategoryOrganizationEntity.createQueryBuilder()
      .delete()
      .from(CategoryOrganizationEntity)
      .where({ id })
      .execute();
  }
}
