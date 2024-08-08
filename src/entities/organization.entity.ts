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
import { Sub_Category_Org_Entity } from './sub_category_org.entity';
import { Phone_Organization_Entity } from './phone_organization.entity';
import { CommentAndRateEntity } from './commentAndRate.entity';
import { Picture_Organization_Entity } from './picture_organization.entity';
import { Saved_Organization_Entity } from './saved_org.entity';

@Entity()
export class OrganizationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  organization_name: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  section: string;

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
  scheduler: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  payment_type: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  transport: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  comment: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  location: string;

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
    type: 'character varying',
    nullable: true,
  })
  bank_account: string;

  @Column({
    type: 'float',
    default: 0,
    nullable : true
  })
  common_rate: number;

  @Column({
    type: 'integer',
    default: 0,
    nullable : true
  })
  number_of_raters: number;

  @ManyToOne(
    () => Sub_Category_Org_Entity,
    (sub_category_org) => sub_category_org.organizations,
    { nullable: true },
  )
  sub_category_org: Sub_Category_Org_Entity;

  @OneToMany(() => Phone_Organization_Entity, (phone) => phone.organization)
  phones: Phone_Organization_Entity[];

  @OneToMany(
    () => Picture_Organization_Entity,
    (picture) => picture.organization_id,
  )
  pictures: Picture_Organization_Entity[];

  @OneToMany(() => CommentAndRateEntity, (comment) => comment.organization_id)
  comments: CommentAndRateEntity[];

  @OneToMany(
    () => Saved_Organization_Entity,
    (saved_org) => saved_org.organization_id,
  )
  saved_organization: Saved_Organization_Entity[];

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
