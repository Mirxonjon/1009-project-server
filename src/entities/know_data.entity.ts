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
  })
  text: string;

  @Column({
    type: 'jsonb',
  })
  table_arr: any;

  @CreateDateColumn()
  data_sequence: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
