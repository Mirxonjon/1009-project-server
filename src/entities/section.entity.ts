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

@Entity()
export class Section_Entity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  title: string;

  // @ManyToOne(
  //   () => Category_Organization_Entity,
  //   (category_org) => category_org.sub_category_orgs,
  //   { nullable: true },
  // )
  // category_org: Category_Organization_Entity;

  @OneToMany(() => OrganizationEntity, (org) => org.sub_category_org)
  organizations: OrganizationEntity[];

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
