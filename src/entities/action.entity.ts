import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Sub_Category_Org_Entity } from './sub_category_org.entity';
  
  @Entity()
  export class Action_Entity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      type: 'character varying',
      nullable: true,
    })
    action: string;
  

  
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
  