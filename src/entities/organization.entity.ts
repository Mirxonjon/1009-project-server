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
import { SubCategoryOrgEntity } from './sub_category_org.entity';
import { PhoneOrganizationEntity } from './phone_organization.entity';
import { CommentAndRateEntity } from './comment_and_rate';
import { PictureOrganizationEntity } from './picture_organization.entity';
import { SavedOrganizationEntity } from './saved_org.entity';
import { UsersEntity } from './users.entity';
import { SectionEntity } from './section.entity';

@Entity()
export class OrganizationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  organization_name: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: true,
  // })
  // section: string;

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
    type: 'character varying',
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

  @ManyToOne(
    () => SubCategoryOrgEntity,
    (sub_category_org) => sub_category_org.organizations,
    { nullable: true },
  )
  sub_category_org: SubCategoryOrgEntity;

  @ManyToOne(() => SectionEntity, (section) => section.organizations, {
    nullable: true,
  })
  sectionId: SectionEntity;

  @ManyToOne(() => UsersEntity, (user) => user.my_organization, {
    nullable: true,
  })
  userId: UsersEntity;

  @OneToMany(() => PhoneOrganizationEntity, (phone) => phone.organization, {
    onDelete: 'CASCADE',
  })
  phones: PhoneOrganizationEntity[];

  @OneToMany(
    () => PictureOrganizationEntity,
    (picture) => picture.organization_id,
    { onDelete: 'CASCADE' },
  )
  pictures: PictureOrganizationEntity[];

  @OneToMany(() => CommentAndRateEntity, (comment) => comment.organization_id)
  comments: CommentAndRateEntity[];

  @OneToMany(
    () => SavedOrganizationEntity,
    (saved_org) => saved_org.organization_id,
  )
  saved_organization: SavedOrganizationEntity[];

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
