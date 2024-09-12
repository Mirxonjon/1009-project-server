import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubCategoryOrgEntity } from './sub_category_org.entity';
import { OrganizationEntity } from './organization.entity';

@Entity()
export class SegmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
    unique: true,
  })
  title: string;

  @OneToMany(() => OrganizationEntity, (org) => org.sub_category_org)
  organizations: OrganizationEntity[];

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

  // @OneToMany(
  //   () => SubCategoryOrgEntity,
  //   (sub_category_org) => sub_category_org.category_org
  // )
  // sub_category_orgs: SubCategoryOrgEntity[];

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
