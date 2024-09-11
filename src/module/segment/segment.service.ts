import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateSegmentDto } from './dto/create_segment.dto';
import { UpdateSegmentDto } from './dto/update_segment.dto';
import { DeleteResult, ILike, InsertResult, UpdateResult } from 'typeorm';

import { SegmentEntity } from 'src/entities/segment.entity';
import { GetAllSegmentDto } from './dto/get_all_segment.dto';
@Injectable()
export class SegmentService {
  private logger = new Logger(SegmentService.name);

  async findAll(params: GetAllSegmentDto) {
    const methodName = this.findAll.name;

    const { page, pageSize, all, search, } = params;
    if (all == 'true') {
      console.log('okkk');

      const [result, total] =
        await SegmentEntity.findAndCount(
          {
            where: {
              title: search == 'null' ? null : ILike(`%${search}%`)
            }
          }
        ).catch((e) => {
          console.log(e.message, 'ookkk');

          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        });

      if (!result) {
        this.logger.debug(
          `Method: ${methodName} - Segment Not Found: `,
          result
        );
        throw new HttpException('Segment Not Found', HttpStatus.NOT_FOUND);
      }
      // return findAllSegment;
      return {
        result,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 'all',
          totalItems: total,
        },
      };
    } else {
      const offset = (+page - 1) * +pageSize;
      const [result, total] = await SegmentEntity.findAndCount({
        where: {
          title: search == 'null' ? null : ILike(`%${search}%`)
        },
        skip: offset,
        take: pageSize
      })

      if (!result) {
        this.logger.debug(
          `Method: ${methodName} - Segment Not Found: `,
          result
        );
        throw new HttpException('Not found Segment', HttpStatus.NOT_FOUND);
      }
      const totalPages = Math.ceil(total / +pageSize);

      return {
        result,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize,
          totalItems: total,
        },
      };

    }



  }

  async findOne(id: string) {
    const methodName = this.findOne.name;

    const findSegment: SegmentEntity =
      await SegmentEntity.findOne({
        where: {
          id: id,
        },
      });

    if (!findSegment) {
      this.logger.debug(`Method: ${methodName} - Segment find One Not Found: `, findSegment);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return findSegment;
  }

  async create(body: CreateSegmentDto) {
    const methodName = this.create.name;

    try {
      const findSegment = await SegmentEntity.findOneBy({
        title: body.title,
      });
      if (findSegment) {
        this.logger.debug(`Method: ${methodName} - Already created this category: `, findSegment);
        throw new HttpException(
          'Already created this category',
          HttpStatus.FOUND
        );
      }

      const createSegment: InsertResult = await SegmentEntity.createQueryBuilder()
        .insert()
        .into(SegmentEntity)
        .values({
          title: body.title,
        })
        .execute()
        .catch(() => {
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        });

      if (!createSegment.identifiers[0].id) {
        this.logger.debug(
          `Method: ${methodName} - Segment insert error:`,
          createSegment
        );
        throw new HttpException(
          `Error in inserting to Segment`,
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        message: 'Segment created successfully',
      }
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error trace: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }





  }

  async update(id: string, body: UpdateSegmentDto) {
    const methodName = this.update.name;
    try {
      const findSegment = await SegmentEntity.findOneBy({
        id: id,
      }).catch(() => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      if (!findSegment) {
        this.logger.debug(
          `Method: ${methodName} -  find Segment not found  Error:`,
          findSegment
        );
        throw new HttpException('find Segment not found ', HttpStatus.NOT_FOUND);
      }

      const updateSegment: UpdateResult = await SegmentEntity.createQueryBuilder()
        .update(SegmentEntity)
        .set({
          title: body.title || findSegment.title,
        })
        .where({ id })
        .execute()

      if (!updateSegment.affected) {
        this.logger.debug(
          `Method: ${methodName} - Segment update  error:`,
          updateSegment
        );
        throw new HttpException(
          `Error in update to Segment`,
          HttpStatus.BAD_REQUEST
        );
      }

    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error trace: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    const methodName = this.remove.name;

    try {
      const findSegment = await SegmentEntity.findOneBy({
        id: id,
      })

      if (!findSegment) {
        this.logger.debug(
          `Method: ${methodName} -  find Segment not found  Error:`,
          findSegment
        );
        throw new HttpException('find Segment not found ', HttpStatus.NOT_FOUND);
      }

      const deleteSegment: DeleteResult = await SegmentEntity.createQueryBuilder()
        .delete()
        .from(SegmentEntity)
        .where({ id })
        .execute();

      if (!deleteSegment.affected) {
        this.logger.debug(
          `Method: ${methodName} - Segment delete  error:`,
          deleteSegment
        );
        throw new HttpException(
          `Error in delete to Segment`,
          HttpStatus.BAD_REQUEST
        );
      }


    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error trace: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
