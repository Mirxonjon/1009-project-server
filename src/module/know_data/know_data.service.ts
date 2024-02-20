import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateKnowDataDto } from './dto/create_know_data.dto';

import { UpdateKnowDataDto } from './dto/update_know_data.dto';

import { CommunalEntity } from 'src/entities/communal.entity';
import { InformationTashkentEntity } from 'src/entities/information_Tashkent.entity';
import { KnowDataEntity } from 'src/entities/know_data.entity';

@Injectable()
export class KnowDataServise {
  async findAll() {
    const findAll = await KnowDataEntity.find({
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
        text: body.text,
        table_arr: body.table_arr,
        mention : body.mention,
        warning: body.warning,
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
      throw new HttpException('Information Tashkent data not found', HttpStatus.NOT_FOUND);
    }

    const updatedVideo = await KnowDataEntity.update(id, {
      text: body.text || findKnowData.text,
      table_arr: body.table_arr || findKnowData.table_arr,
      mention : body.mention || findKnowData.mention,
      warning: body.warning || findKnowData.warning,
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
