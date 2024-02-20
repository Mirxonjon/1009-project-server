import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInformationTashkentDto } from './dto/create_information_tashkent.dto';

import { UpdateInformationTashkentDto } from './dto/update_information_tashkent.dto';

import { CommunalEntity } from 'src/entities/communal.entity';
import { InformationTashkentEntity } from 'src/entities/information_Tashkent.entity';

@Injectable()
export class InformationTashkentServise {
  async findAll() {
    const findAll = await InformationTashkentEntity.find({
      order: {
        data_sequence: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAll;
  }

  async create(body: CreateInformationTashkentDto) {
    if (!body.text && !body.table_arr) {
      throw new HttpException(
        'text or table_arr should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    await InformationTashkentEntity.createQueryBuilder()
      .insert()
      .into(InformationTashkentEntity)
      .values({
        text: body.text,
        table_arr: body.table_arr,
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
  }
  async update(id: string, body: UpdateInformationTashkentDto) {
    const findInformationTashkent = await InformationTashkentEntity.findOne({
      where: { id },
    });

    if (!findInformationTashkent) {
      throw new HttpException('Information Tashkent data not found', HttpStatus.NOT_FOUND);
    }

    const updatedVideo = await InformationTashkentEntity.update(id, {
      text: body.text || findInformationTashkent.text,
      table_arr: body.table_arr || findInformationTashkent.table_arr,
    });

    return updatedVideo;
  }

  async remove(id: string) {
    const findInformationTashkent = await InformationTashkentEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findInformationTashkent) {
      throw new HttpException('Entertainment not found', HttpStatus.NOT_FOUND);
    }

    await InformationTashkentEntity.delete({ id });
  }
}