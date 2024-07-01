import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEntertainmentCategoryDto } from './dto/create_entertainment_categories.dto';
import { UpdateEntertainmentCategory } from './dto/update_entertainment_categories.dto';
import { Like } from 'typeorm';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
@Injectable()
export class EntertainmentCategoriesService {
  async getall() {
    const allEntertainmentCategory =
      await EntertainmentCategoriesEntity.find().catch((e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
    return allEntertainmentCategory;
  }

  async findOne(id: string, language: string) {
    const findCategory: EntertainmentCategoriesEntity =
      await EntertainmentCategoriesEntity.findOne({
        where: {
          id: id,
          entertainments: {
            language: language,
          },
        },
        relations: {
          entertainments: true,
        },
      });

    if (!findCategory) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return findCategory;
  }

  async create(body: CreateEntertainmentCategoryDto) {
    const findCategory = await EntertainmentCategoriesEntity.findOneBy({
      title: body.title,
    });

    if (findCategory) {
      throw new HttpException(
        'Already created this category',
        HttpStatus.FOUND,
      );
    }
    await EntertainmentCategoriesEntity.createQueryBuilder()
      .insert()
      .into(EntertainmentCategoriesEntity)
      .values({
        title: body.title.toLowerCase(),
        title_ru: body.title_ru.toLowerCase(),
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async update(id: string, body: UpdateEntertainmentCategory) {
    const findCategory = await EntertainmentCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
    }

    await EntertainmentCategoriesEntity.createQueryBuilder()
      .update(EntertainmentCategoriesEntity)
      .set({
        title: body.title.toLowerCase() || findCategory.title,
        title_ru: body.title_ru.toLowerCase() || findCategory.title_ru,
      })
      .where({ id })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async remove(id: string) {
    const findCategory = await EntertainmentCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Not found Category', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    await EntertainmentCategoriesEntity.createQueryBuilder()
      .delete()
      .from(EntertainmentCategoriesEntity)
      .where({ id })
      .execute();
  }
}
