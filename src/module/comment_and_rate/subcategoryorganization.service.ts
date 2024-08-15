import { HttpException, HttpStatus, Injectable, Body } from '@nestjs/common';
import { CreateCommentAndRateDto } from './dto/create_CommentAndRate.dto';

import { UpdateCommentAndRateDto } from './dto/update_CommentAndRate.dto';

import { SubCategoryOrgEntity } from 'src/entities/sub_category_org.entity';
import { CategoryOrganizationEntity } from 'src/entities/category_org.entity';
import { CommentAndRateEntity } from 'src/entities/comment_and_rate';
import { CustomRequest, UserType } from 'src/types';
import { OrganizationEntity } from 'src/entities/organization.entity';

@Injectable()
export class CommentAndRateServise {
  async findAll() {
    const findAllSubCategories = await SubCategoryOrgEntity.find({
      order: {
        create_data: 'asc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAllSubCategories;
  }

  async findOne(id: string) {
    const findOne = await CommentAndRateEntity.find({
      where: {
        id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findOne;
  }

  async create(user: UserType, body: CreateCommentAndRateDto) {
    console.log(body, 'jjj');

    const findOrganization = await OrganizationEntity.findOne({
      where: {
        id: body.organization_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findOrganization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    const findCommentAndRate = await CommentAndRateEntity.findOne({
      where: {
        user_id: {
          id: user.userId,
        },
        organization_id: {
          id: findOrganization.id,
        },
      },
    });
    console.log(findCommentAndRate);

    if (findCommentAndRate) {
      const update = await CommentAndRateEntity.update(findCommentAndRate.id, {
        rate: +body.rate,
        comment: body.comment,
      }).catch((e) => {
        console.log(e);

        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });

      if (update) {
        const rate =
          (findOrganization.number_of_raters * findOrganization.common_rate +
            body.rate -
            findCommentAndRate.rate) /
          findOrganization.number_of_raters;
        // console.log(rate,(findOrganization.number_of_raters * findOrganization.common_rate + body.rate),findOrganization.number_of_raters + 1 );

        await OrganizationEntity.update(findOrganization.id, {
          common_rate: rate,
          number_of_raters: findOrganization.number_of_raters,
        }).catch((e) => {
          console.log(e);

          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });
      }
      // throw new HttpException('You alrady commented', HttpStatus.FOUND);
      return;
    }

    const createCommentAndRate = await CommentAndRateEntity.createQueryBuilder()
      .insert()
      .into(CommentAndRateEntity)
      .values({
        rate: +body.rate,
        comment: body.comment,
        organization_id: findOrganization,
        user_id: {
          id: user.userId,
        },
      })
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });

    if (createCommentAndRate) {
      const rate =
        (findOrganization.number_of_raters * findOrganization.common_rate +
          body.rate) /
        (findOrganization.number_of_raters + 1);
      // console.log(rate,(findOrganization.number_of_raters * findOrganization.common_rate + body.rate),findOrganization.number_of_raters + 1 );

      await OrganizationEntity.update(findOrganization.id, {
        common_rate: rate,
        number_of_raters: findOrganization.number_of_raters + 1,
      }).catch((e) => {
        console.log(e);

        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });

      return;
    }
  }

  // async update(id: string, body: UpdateCommentAndRateDto) {
  //   const findSubCategoryOrg = await Sub_Category_Org_Entity.findOne({
  //     where: { id },
  //   });

  //   if (!findSubCategoryOrg) {
  //     throw new HttpException('Sub Category not found', HttpStatus.NOT_FOUND);
  //   }
  //   let findCategory: Category_Organization_Entity | null = null;
  //   if (body.category_id) {
  //     findCategory = await Category_Organization_Entity.findOneBy({ id }).catch(
  //       (e) => {
  //         throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
  //       },
  //     );
  //     if (!findCategory) {
  //       throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
  //     }
  //   }

  //   const updatedVideo = await Sub_Category_Org_Entity.update(id, {
  //     title: body.title.toLowerCase() || findSubCategoryOrg.title,

  //     category_org: findCategory,
  //   });

  //   return updatedVideo;
  // }

  async remove(id: string) {
    const findCommentAndRate = await CommentAndRateEntity.findOneBy({
      id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCommentAndRate) {
      throw new HttpException('Sub Catgeory not found', HttpStatus.NOT_FOUND);
    }

    await CommentAndRateEntity.delete({ id });
  }
}
