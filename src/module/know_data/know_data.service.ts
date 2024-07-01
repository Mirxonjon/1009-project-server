import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateKnowDataDto } from './dto/create_know_data.dto';
import { UpdateKnowDataDto } from './dto/update_know_data.dto';
import { KnowDataEntity } from 'src/entities/know_data.entity';

@Injectable()
export class KnowDataServise {
  async findAll(language: string) {
    const findAll = await KnowDataEntity.find({
      where: {
        language: language,
      },
      order: {
        data_sequence: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAll;
  }

  async create(body: CreateKnowDataDto) {
    if (!body.text && !body.table_arr) {
      throw new HttpException(
        'text or table_arr should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    await KnowDataEntity.createQueryBuilder()
      .insert()
      .into(KnowDataEntity)
      .values({
        title: body.title,
        language: body.language,
        type: body.type,
        text: body.text,
        mention: body.mention,
        warning: body.warning,
        table_arr: body.table_arr,
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
  }
  async update(id: string, body: UpdateKnowDataDto) {
    const findKnowData = await KnowDataEntity.findOne({
      where: { id },
    });

    if (!findKnowData) {
      throw new HttpException(
        'Information Tashkent data not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedVideo = await KnowDataEntity.update(id, {
      title: body.title || findKnowData.title,
      type: body.type || findKnowData.type,
      text: body.text || findKnowData.text,
      language: body.language || findKnowData.language,
      mention: body.mention || findKnowData.mention,
      warning: body.warning || findKnowData.warning,
      table_arr: body.table_arr || findKnowData.table_arr,
    });

    return updatedVideo;
  }

  async remove(id: string) {
    const findKnowData = await KnowDataEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findKnowData) {
      throw new HttpException('Entertainment not found', HttpStatus.NOT_FOUND);
    }

    await KnowDataEntity.delete({ id });
  }
}
