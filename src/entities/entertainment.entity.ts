import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntertainmentCategoriesEntity } from './entertainment_Categories.entity';

@Entity()
export class EntertainmentsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  title: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  type: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  text: JSON;


  @Column({
    type: 'jsonb',
    nullable: true,
  })
  table_arr: JSON;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  mention: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  warning: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title_ru: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  text_ru: JSON;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  table_arr_ru: JSON;

  @Column({
    type: 'character varying',
  })
  mention_ru: string;
  
  @Column({
    type: 'character varying',
  })
  warning_ru: string;

  
  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn()
  data_sequence: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @ManyToOne(
    () => EntertainmentCategoriesEntity,
    (categories) => categories.entertainments,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'category_id' })
  category_id: EntertainmentCategoriesEntity;
}
