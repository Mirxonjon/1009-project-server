import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { Picture_Organization_Entity } from 'src/entities/picture_organization.entity';
import { deleteFileCloud, googleCloudAsync } from 'src/utils/google_cloud';
import {
  allowedImageFormats,
} from 'src/utils/videoAndImageFormat';
import { CreatePictureDto } from './dto/create_picture.dto';
import { OrganizationEntity } from 'src/entities/organization.entity';
import { UpdatePictureDto } from './dto/update_history.dto';


@Injectable()
export class PictureServise {

  async findOne(id: string  ) {
    const findHeaderImage = await Picture_Organization_Entity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findHeaderImage) {
      throw new HttpException('Picture not found', HttpStatus.NOT_FOUND);
    }
  return findHeaderImage
  }

 
  async findAll() {
    const findHeaderImages = await Picture_Organization_Entity.find({
      order:{
        create_data :'desc'
      }
    });

    if (!findHeaderImages) {
      throw new HttpException('Header Images not found', HttpStatus.NOT_FOUND);
    }

    return findHeaderImages;
  }

  async create(
    picture: Express.Multer.File,
    createPicture : CreatePictureDto
  ) {

    const findOrganization = await OrganizationEntity.findOne({
      where : {
        id : createPicture.organizationId
      }
    })

    if (!findOrganization) {
      throw new HttpException(
        'Not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!picture) {
      throw new HttpException(
        'picture should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }
    

    const formatImage = extname(picture?.originalname).toLowerCase();

    if (allowedImageFormats.includes(formatImage)) {
      
          const linkImage :string = await googleCloudAsync(picture)
          

        await Picture_Organization_Entity.createQueryBuilder()
          .insert()
          .into(Picture_Organization_Entity)
          .values({
            image_link : linkImage,
            organization_id : {
              id: findOrganization.id
            }
          })
          .execute()
          .catch((e) => { 
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });
        
    } else {
      throw new HttpException(
        'image should  be format jpg , png , jpeg , pnmj , svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    header_image: Express.Multer.File,
    body : UpdatePictureDto
  ) {
    const findPicture = await Picture_Organization_Entity.findOne({
      where: { id },
      relations : {
        organization_id :true
      }
    });

    let organizationId = findPicture.organization_id 
  if(organizationId != null){
    organizationId = await OrganizationEntity.findOne({
      where : {
        id: body.organizationId
      }
    })
  }


    if (!findPicture) {
      throw new HttpException('Picture not found', HttpStatus.NOT_FOUND);
    }

    let formatImage: string = 'Not image';

      if (header_image) {
        formatImage = extname(header_image.originalname).toLowerCase();
      }

    if (
      allowedImageFormats.includes(formatImage)  ||
      formatImage === 'Not image'
    ) {

        let picture = findPicture?.image_link;


        if (formatImage !== 'Not image') {
          picture = await googleCloudAsync(header_image);
        }

      const updated = await Picture_Organization_Entity.update(id, {
        image_link :picture ,
        organization_id : organizationId
      }).catch(e => {console.log(e)
      });

      return updated;

     

    } else {
      throw new HttpException(
        'Image should be in the format jpg, png, jpeg, pnmj, svg, 1',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const findPicture = await Picture_Organization_Entity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findPicture) {
      throw new HttpException('Header Image not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findPicture?.image_link);

    if (!imageLink) {
      throw new HttpException(
        'The Header image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }


    await Picture_Organization_Entity.delete({ id });
  }
}
