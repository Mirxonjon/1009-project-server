import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class KnowDataEntity extends BaseEntity {
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
  table_arr: any;

  @Column({
    type: 'character varying',
  })
  mention: string;

  @Column({
    type: 'character varying',
  })
  warning: string;

  @CreateDateColumn()
  data_sequence: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
