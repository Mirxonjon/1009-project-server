import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ControlUsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 300,
    nullable: false,
  })
  full_name: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  username: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'character varying',
    default: 'user',
  })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  // @OneToMany(() => TakeEntity, (course) => course.user_id)
  // active_users: TakeEntity[];

  // @OneToMany(() => TakeBooksEntity, (take_book) => take_book.user_id)
  // take_books_users: TakeEntity[];
}
