import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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
    type: 'character varying',
    nullable:true
  })
  text: string;



  @Column({
    type: 'jsonb',
  })
  table_arr: any;

  @Column({
    type: 'character varying',
    nullable: true
  })
  mention: string;

  @Column({
    type: 'character varying',
    nullable: true
  })
  warning: string;

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
