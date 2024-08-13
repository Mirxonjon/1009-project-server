import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class Picture_Organization_Entity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
  })
  image_link: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.pictures)
  organization_id: OrganizationEntity;

  @ManyToOne(() => OrganizationEntity, (org) => org.pictures)
  organization_version_id?: OrganizationEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
