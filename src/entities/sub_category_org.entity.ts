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
import { CategoryOrganizationEntity } from './category_org.entity';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class SubCategoryOrgEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  title: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: true,
  // })
  // title_ru: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: true,
  // })
  // title_en: string;

  @ManyToOne(
    () => CategoryOrganizationEntity,
    (category_org) => category_org.sub_category_orgs,
    { nullable: true }
  )
  category_org: CategoryOrganizationEntity;

  @OneToMany(() => OrganizationEntity, (org) => org.sub_category_org)
  organizations: OrganizationEntity[];

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
