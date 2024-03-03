import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NumbersCodesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  type: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  text: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  table_arr: JSON;

  @Column({
    type: 'character varying',
  })
  mention: string;

  @Column({
    type: 'character varying',
  })
  warning: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title_ru: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  text_ru: string;

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
}
