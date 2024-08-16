import { HttpException, HttpStatus, Injectable, Body } from '@nestjs/common';
import { CreateSubCategoryOrganizationDto } from './dto/create_subcategoryorganization.dto';

import { UpdateSubCategoryOrganizationDto } from './dto/update_subcategoryorganization.dto';

import { SubCategoryOrgEntity } from 'src/entities/sub_category_org.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';

@Injectable()
export class SubCategoryOrganizationServise {
  async findAll() {
    const findAllSubCategories = await SubCategoryOrgEntity.find({
      order: {
        create_data: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAllSubCategories;
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
