import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Phone_Organization_Versions_Entity } from './phone_organizations_versions.entity';
import { PictureOrganizationVersionsEntity } from './picture_organization_versions.entity';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class OrganizationVersionsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => OrganizationEntity, (organisation) => organisation.id)
  organization_id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  organization_name: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  main_organization: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  manager: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  scheduler: JSON;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  payment_types: JSON;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  transport: JSON;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  comment: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  location: JSON;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  segment: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  account: string;

  @Column({
    type: 'character varying',
    default: 'cc',
    nullable: true,
  })
  added_by: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  inn: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  bank_account: string;

  @Column({
    type: 'float',
    default: 0,
    nullable: true,
  })
  common_rate: number;

  @Column({
    type: 'integer',
    default: 0,
    nullable: true,
  })
  number_of_raters: number;

  @Column({
    type: 'character varying',
    nullable: true,
    default: '0',
  })
  status: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  sub_category_org: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  sectionId: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  userId: string;

  @OneToMany(
    () => Phone_Organization_Versions_Entity,
    (phone) => phone.organization,
    {
      onDelete: 'CASCADE',
    }
  )
  phones: Phone_Organization_Versions_Entity[];

  @OneToMany(
    () => PictureOrganizationVersionsEntity,
    (picture) => picture.organization_id,
    { onDelete: 'CASCADE' }
  )
  pictures: PictureOrganizationVersionsEntity[];

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
