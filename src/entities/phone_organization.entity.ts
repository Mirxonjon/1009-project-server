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
import { OrganizationEntity } from './organization.entity';

@Entity()
export class Phone_Organization_Entity extends BaseEntity {
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

  @ManyToOne(() => OrganizationEntity, (org) => org.phones , { onDelete: 'CASCADE' })
  organization: OrganizationEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
