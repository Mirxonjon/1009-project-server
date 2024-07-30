import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Action_Entity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  action_uz: string;
  @Column({
    type: 'character varying',
    nullable: true,
  })
  action_ru: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  action_en: string;

  // @OneToMany(
  //   () => Sub_Category_Org_Entity,
  //   (sub_category_org) => sub_category_org.category_org,
  // )
  // sub_category_orgs: Sub_Category_Org_Entity[];

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
