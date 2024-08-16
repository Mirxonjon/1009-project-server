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
import { OrganizationVersionsEntity } from './organization_versions.entity';

@Entity()
export class Phone_Organization_Versions_Entity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  number: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  type_number: string;

  @ManyToOne(() => OrganizationVersionsEntity, (org) => org.phones, {
    onDelete: 'CASCADE',
  })
  organization: OrganizationVersionsEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
