import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationVersionsEntity } from './organization_versions.entity';

@Entity()
export class PictureOrganizationVersionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  })
  image_link: string;

  @ManyToOne(() => OrganizationVersionsEntity, (org) => org.pictures, {
    onDelete: 'CASCADE',
  })
  organization_id: OrganizationVersionsEntity;

  // @ManyToOne(() => OrganizationVersionsEntity, (org) => org.pictures)
  // organization_version_id?: OrganizationVersionsEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
