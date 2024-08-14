import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create_section.dto';
import { UpdateSectionDto } from './dto/update_section.dto';
import { Like } from 'typeorm';
import { EntertainmentCategoriesEntity } from 'src/entities/entertainment_Categories.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { SectionEntity } from 'src/entities/section.entity';
@Injectable()
export class SectionService {
  async findAll() {
    const allSection = await SectionEntity.find().catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    return allSection;
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
