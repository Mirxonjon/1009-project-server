import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizationCategoryDto } from './dto/create_organization_categories.dto';
import { UpdateOrganizationCategoryDto } from './dto/update_organization_categories.dto';
import { Like } from 'typeorm';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { Category_Organization_Entity } from 'src/entities/category_org.entity';
@Injectable()
export class OrganizationCategoriesService {
  async findAll() {
    const allOrganizationCategory =
      await Category_Organization_Entity.find().catch((e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    return allOrganizationCategory;
  }

  async findOne(id: string) {
    const findCategory: Category_Organization_Entity =
      await Category_Organization_Entity.findOne({
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
    const findCategory = await Category_Organization_Entity.findOneBy({
      title: body.title,
    });

    if (findCategory) {
      throw new HttpException(
        'Already created this category',
        HttpStatus.FOUND
      );
    }
    await Category_Organization_Entity.createQueryBuilder()
      .insert()
      .into(Category_Organization_Entity)
      .values({
        title: body.title.toLowerCase(),
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async update(id: string, body: UpdateOrganizationCategoryDto) {
    const findCategory = await Category_Organization_Entity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
    }

    await Category_Organization_Entity.createQueryBuilder()
      .update(Category_Organization_Entity)
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
    const findCategory = await Category_Organization_Entity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Not found Category', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    await Category_Organization_Entity.createQueryBuilder()
      .delete()
      .from(Category_Organization_Entity)
      .where({ id })
      .execute();
  }
}
