import { HttpException, HttpStatus, Injectable, Body } from '@nestjs/common';
import { CreateEntertainmentsDto } from './dto/create_entertainment.dto';

import { UpdateEntertainmentsDto } from './dto/update_entertainment.dto';

import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { EntertainmentsEntity } from 'src/entities/entertainment.entity';

@Injectable()
export class EntertainmentServise {
  async findAll(language:string) {
    const allbooks = await EntertainmentsEntity.find({
      relations: {
        category_id: true,
      },
      where: {
        language: language
      },
      order: {
        create_data: 'desc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return allbooks;
  }

  async findAllwithCategory(id: string) {
    const findAllwithCategory = await EntertainmentsEntity.find({
      where: {
        category_id: {
          id: id,
        },
      },
      relations: {
        category_id: true,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAllwithCategory;
  }

  async create(body: CreateEntertainmentsDto) {
    if (!body.text && !body.table_arr) {
      throw new HttpException(
        'text or table_arr should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const findCategory = await EntertainmentCategoriesEntity.findOne({
      where: {
        id: body.category_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException(' Category not found', HttpStatus.NOT_FOUND);
    }

    await EntertainmentsEntity.createQueryBuilder()
      .insert()
      .into(EntertainmentsEntity)
      .values({
        title: body.title,
        language: body.language,
        text: body.text,
        type: body.type,
        mention: body.mention,
        warning: body.warning,
        table_arr: body.table_arr,
        category_id: findCategory,
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
  }
  async update(id: string, body: UpdateEntertainmentsDto) {
    const findEntertainment = await EntertainmentsEntity.findOne({
      where: { id },
      relations: { category_id: true },
      select: { category_id: { id: true } },
    });

    if (!findEntertainment) {
      throw new HttpException('Entertainment not found', HttpStatus.NOT_FOUND);
    }

    const updatedVideo = await EntertainmentsEntity.update(id, {
      title: body.title || findEntertainment.title,
      language: body.language || findEntertainment.language,
      text: body.text || findEntertainment.text,
      type: body.type || findEntertainment.type,
      mention: body.mention || findEntertainment.mention,
      warning: body.warning || findEntertainment.warning,
      table_arr: body.table_arr || findEntertainment.table_arr,
      category_id:
        body.category_id == 'null'
          ? (findEntertainment.category_id.id as any)
          : body.category_id,
    });

    return updatedVideo;
  }

  async remove(id: string) {
    const findEntertainment = await EntertainmentsEntity.findOneBy({
      id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findEntertainment) {
      throw new HttpException('Entertainment not found', HttpStatus.NOT_FOUND);
    }

    await EntertainmentsEntity.delete({ id });
  }
}
