import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommunalDto } from './dto/create_communal.dto';

import { UpdateCommunalDto } from './dto/update_communal.dto';

import { CommunalEntity } from 'src/entities/communal.entity';

@Injectable()
export class CommunalServise {
  async findAll() {
    const findAll = await CommunalEntity.find({
      order: {
        data_sequence: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAll;
  }

  async create(body: CreateCommunalDto) {
    if (!body.text && !body.table_arr) {
      throw new HttpException(
        'text or table_arr should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    await CommunalEntity.createQueryBuilder()
      .insert()
      .into(CommunalEntity)
      .values({
        text: body.text,
        title: body.title,
        type: body.type,
        table_arr: body.table_arr,
        mention: body.mention,
        warning: body.warning,
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
  }
  async update(id: string, body: UpdateCommunalDto) {
    const findCommunal = await CommunalEntity.findOne({
      where: { id },
    });

    if (!findCommunal) {
      throw new HttpException('Communal not found', HttpStatus.NOT_FOUND);
    }

    const updatedVideo = await CommunalEntity.update(id, {
      title: body.title || findCommunal.title,
      type: body.type || findCommunal.type,
      text: body.text || findCommunal.text,
      table_arr: body.table_arr || findCommunal.table_arr,
      mention: body.mention || findCommunal.mention,
      warning: body.warning || findCommunal.warning,
    });

    return updatedVideo;
  }

  async remove(id: string) {
    const findCommunal = await CommunalEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCommunal) {
      throw new HttpException('Entertainment not found', HttpStatus.NOT_FOUND);
    }

    await CommunalEntity.delete({ id });
  }
}
