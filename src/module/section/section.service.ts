import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateSectionDto } from './dto/create_section.dto';
import { UpdateSectionDto } from './dto/update_section.dto';
import { ILike, Like } from 'typeorm';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { SectionEntity } from 'src/entities/section.entity';
import { GetAllSectionsDto } from './dto/get_all_sections.dto';
@Injectable()
export class SectionService {
  private logger = new Logger(SectionService.name);

  async findAll(params: GetAllSectionsDto) {
    const methodName = this.findAll.name;
    const { page, pageSize, all, search, } = params;

    if (all == 'true') {
      const [result, total] =
        await SectionEntity.findAndCount(
          {
            where: {
              title: search == 'null' ? null : ILike(`%${search}%`)
            }
          }
        ).catch((e) => {
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });

      if (!result) {
        this.logger.debug(
          `Method: ${methodName} - Categories Not Found: `,
          result
        );
        throw new HttpException('Categories Not Found', HttpStatus.NOT_FOUND);
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
      const [result, total] = await SectionEntity.findAndCount({
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
    const findSection: SectionEntity = await SectionEntity.findOne({
      where: {
        id: id,
      },
    });

    if (!findSection) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return findSection;
  }

  async create(body: CreateSectionDto) {
    const findSection = await SectionEntity.findOneBy({
      title: body.title,
    });

    if (findSection) {
      throw new HttpException('Already created this section', HttpStatus.FOUND);
    }
    await SectionEntity.createQueryBuilder()
      .insert()
      .into(SectionEntity)
      .values({
        title: body.title.toLowerCase(),
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async update(id: string, body: UpdateSectionDto) {
    const findSection = await SectionEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findSection) {
      throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
    }

    await SectionEntity.createQueryBuilder()
      .update(SectionEntity)
      .set({
        title: body.title.toLowerCase() || findSection.title,
      })
      .where({ id })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async remove(id: string) {
    const findSection = await SectionEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Not found section', HttpStatus.BAD_REQUEST);
    });

    if (!findSection) {
      throw new HttpException('section not found', HttpStatus.NOT_FOUND);
    }

    await SectionEntity.createQueryBuilder()
      .delete()
      .from(SectionEntity)
      .where({ id })
      .execute();
  }
}
