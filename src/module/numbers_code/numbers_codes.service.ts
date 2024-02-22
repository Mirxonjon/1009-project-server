import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNumbersCodesDto } from './dto/create_numbers_codes.dto';
import { UpdateNumbersCodesDto } from './dto/update_numbers_codes.dto';
import { NumbersCodesEntity } from 'src/entities/Numbers_codes.entity';

@Injectable()
export class NumbersCodesServise {
  async findAll() {
    const findAll = await NumbersCodesEntity.find({
      order: {
        data_sequence: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAll;
  }

  async create(body: CreateNumbersCodesDto) {
    if (!body.text && !body.table_arr) {
      throw new HttpException(
        'text or table_arr should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    await NumbersCodesEntity.createQueryBuilder()
      .insert()
      .into(NumbersCodesEntity)
      .values({
        title : body.title,
        text: body.text,
        table_arr: body.table_arr,
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
  }
  async update(id: string, body: UpdateNumbersCodesDto ) {
    const findNumbersCodes = await NumbersCodesEntity.findOne({
      where: { id },
    });

    if (!findNumbersCodes) {
      throw new HttpException('Information Tashkent data not found', HttpStatus.NOT_FOUND);
    }

    const updatedVideo = await NumbersCodesEntity.update(id, {
      title : body.title || findNumbersCodes.title,
      type : body.type ||  findNumbersCodes.type,
      text: body.text || findNumbersCodes.text,
      table_arr: body.table_arr || findNumbersCodes.table_arr,
      mention : body.mention || findNumbersCodes.mention,
      warning: body.warning || findNumbersCodes.warning,
    });

    return updatedVideo;
  }

  async remove(id: string) {
    const findNumbersCodes = await NumbersCodesEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findNumbersCodes) {
      throw new HttpException('Number codes  not found', HttpStatus.NOT_FOUND);
    }

    await NumbersCodesEntity.delete({ id });
  }
}
