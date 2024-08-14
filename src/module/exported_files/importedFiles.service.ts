import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ImportedFilesTitleEntity } from 'src/entities/imported_files_title.entity';
import { readExcel } from 'src/utils/uploadDataToDatabase';
import { UpdateOrganizationDataDto } from './dto/update_importedFiles.dto';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { PhoneOrganizationEntity } from 'src/entities/phone_organization.entity';
import { extname } from 'path';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ImportedFilesServise {
  async findAll() {
    const findAll = await ImportedFilesTitleEntity.find({
      order: {
        create_data: 'desc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return findAll;
  }

  async updateData(body: UpdateOrganizationDataDto) {
    const file = await readExcel(`${body.fileName}`).catch((e) =>
      console.log(e),
    );

    if (file) {
      console.log(file.length);
      file?.forEach(async (e) => {
        // for (const  e of file) {
        if (e[0]) {
          // console.log(e[0]);
          const findOrg = await OrganizationEntity.findOne({
            where: {
              bank_account: e[6],
            },
          }).catch(() => {
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });

          if (findOrg) {
            console.log(e);
            await OrganizationEntity.createQueryBuilder()
              .update(OrganizationEntity)
              .set({
                organization_name: e[1] || findOrg.organization_name,
                segment: e[3] || findOrg.segment,
                account: e[4] || findOrg.account,
                inn: e[5] || findOrg.inn,
                address: e[7] || findOrg.address,
                email: e[8] || findOrg.email,
              })
              .where('bank_account = :bank_account', { bank_account: e[6] })
              .execute()
              .catch(() => {
                throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
              });

            const findPhoneOrg = await PhoneOrganizationEntity.findOne({
              where: {
                organization: {
                  id: findOrg.id,
                },
              },
              relations: {
                organization: true,
              },
            });
            if (findPhoneOrg) {
              if (e[2]) {
                await PhoneOrganizationEntity.createQueryBuilder()
                  .update(PhoneOrganizationEntity)
                  .set({
                    number: e[2] || findPhoneOrg.number,
                  })
                  .where('id = :id', { id: findPhoneOrg.id })
                  .execute()
                  .catch(() => {
                    throw new HttpException(
                      'Bad Request',
                      HttpStatus.BAD_REQUEST,
                    );
                  });
              }
            } else {
              if (e[2]) {
                await PhoneOrganizationEntity.createQueryBuilder()
                  .insert()
                  .into(PhoneOrganizationEntity)
                  .values({
                    number: e[2],
                    organization: { id: findOrg.id },
                  })
                  .execute()
                  .catch(() => {
                    throw new HttpException(
                      'Bad Request ',
                      HttpStatus.BAD_REQUEST,
                    );
                  });
              }
            }
          } else {
            const createOrg = await OrganizationEntity.createQueryBuilder()
              .insert()
              .into(OrganizationEntity)
              .values({
                organization_name: e[1],
                segment: e[3],
                account: e[4],
                inn: e[5],
                bank_account: e[6],
                address: e[7],
                email: e[8],
                added_by: 'sbs',
              })
              .returning(['id'])
              .execute()
              .catch(() => {
                throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
              });

            if (createOrg) {
              if (e[2]) {
                await PhoneOrganizationEntity.createQueryBuilder()
                  .insert()
                  .into(PhoneOrganizationEntity)
                  .values({
                    number: e[2],
                    organization: { id: createOrg.raw[0].id },
                  })
                  .execute()
                  .catch(() => {
                    throw new HttpException(
                      'Bad Request ',
                      HttpStatus.BAD_REQUEST,
                    );
                  });
              }
            }
          }
        }
      });
    }

    return {
      message: 'update file',
    };
  }

  async uploadFileExcel(
    body: UpdateOrganizationDataDto,
    file: Express.Multer.File,
  ) {
    const fileName = `${body.fileName}${extname(file.originalname)}`;
    const filePath = join(process.cwd(), 'src', 'importedFiles', fileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
      await ImportedFilesTitleEntity.createQueryBuilder()
        .insert()
        .into(ImportedFilesTitleEntity)
        .values({
          title: body.fileName,
        })
        .execute()
        .catch(() => {
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        });
    } catch (error) {
      throw new HttpException(
        'Faylni saqlashda xatolik yuz berdi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Fayl muvaffaqiyatli yuklandi',
      fileName: file.filename,
    };
  }

  async remove(id: string) {
    const findFile = await ImportedFilesTitleEntity.findOneBy({ id }).catch(
      () => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      },
    );
    const filePath = join(
      process.cwd(),
      'src',
      'importedFiles',
      `${findFile.title}.xlsx`,
    );

    if (!findFile) {
      throw new HttpException('fil e not found', HttpStatus.NOT_FOUND);
    }
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new HttpException(
        `Faylni o'chirishdada xatolik yuz berdi`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await ImportedFilesTitleEntity.delete({ id });
  }
}
