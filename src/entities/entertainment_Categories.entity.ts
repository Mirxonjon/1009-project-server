import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntertainmentsEntity } from './entertainment.entity';

@Entity()
export class EntertainmentCategoriesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: false,
  // })
  // title_ru: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToMany(
    () => EntertainmentsEntity,
    (entertainment) => entertainment.category_id,
  )
  entertainments: EntertainmentsEntity[];
}
