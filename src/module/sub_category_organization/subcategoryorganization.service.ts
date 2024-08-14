import { HttpException, HttpStatus, Injectable, Body } from '@nestjs/common';
import { CreateSubCategoryOrganizationDto } from './dto/create_subcategoryorganization.dto';

import { UpdateSubCategoryOrganizationDto } from './dto/update_subcategoryorganization.dto';

import { Sub_Category_Org_Entity } from 'src/entities/sub_category_org.entity';
import { Category_Organization_Entity } from 'src/entities/category_org.entity';

@Injectable()
export class SubCategoryOrganizationServise {
  async findAll() {
    const findAllSubCategories = await Sub_Category_Org_Entity.find({
      order: {
        create_data: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAllSubCategories;
  }

  async findOne(id: string) {
    const findOne = await Sub_Category_Org_Entity.find({
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
    const findCategory = await Category_Organization_Entity.findOne({
      where: {
        id: body.category_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException(' Category not found', HttpStatus.NOT_FOUND);
    }

    await Sub_Category_Org_Entity.createQueryBuilder()
      .insert()
      .into(Sub_Category_Org_Entity)
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
    const findSubCategoryOrg = await Sub_Category_Org_Entity.findOne({
      where: { id },
    });

    if (!findSubCategoryOrg) {
      throw new HttpException('Sub Category not found', HttpStatus.NOT_FOUND);
    }
    let findCategory: Category_Organization_Entity | null = null;
    if (body.category_id) {
      findCategory = await Category_Organization_Entity.findOneBy({ id }).catch(
        (e) => {
          throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
        }
      );
      if (!findCategory) {
        throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
      }
    }

    const updatedVideo = await Sub_Category_Org_Entity.update(id, {
      title: body.title.toLowerCase() || findSubCategoryOrg.title,

      category_org: findCategory,
    });

    return updatedVideo;
  }

  async remove(id: string) {
    const findSubCatgory = await Sub_Category_Org_Entity.findOneBy({
      id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findSubCatgory) {
      throw new HttpException('Sub Catgeory not found', HttpStatus.NOT_FOUND);
    }

    await Sub_Category_Org_Entity.delete({ id });
  }
}
