import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category_Organization_Entity } from './category_org.entity';
import { OrganizationEntity } from './organization.entity';
import { UsersEntity } from './users.entity';

@Entity()
export class Saved_Organization_Entity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.saved_organization)
  organization_id: OrganizationEntity;

  @ManyToOne(() => UsersEntity, (user) => user.saved_organization)
  user_id: UsersEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
