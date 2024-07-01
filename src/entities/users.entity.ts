import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentAndRateEntity } from './commentAndRate.entity';
import { Saved_Organization_Entity } from './saved_org.entity';

@Entity()
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  full_name: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: false,
  // })
  // number: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  username: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    // transformer:
  })
  password: string;

  @Column({
    type: 'character varying',
    default: 'user',
  })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  // @CreateDateColumn({ name: 'created_at' })
  // create_data: Date;

  // //
  // @Column({
  //   type: 'character varying',
  //   length: 100,
  //   nullable: false,
  // })
  // name: string;

  // @Column({
  //   type: 'character varying',
  //   length: 100,
  //   nullable: false,
  //   unique: true,
  // })
  // email: string;

  // @Column({
  //   type: 'character varying',
  //   length: 200,
  //   nullable: true,
  // })
  // surname: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: false,
  // })
  // was_born_date: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: true,
  // })
  // image: string;

  // @OneToMany(() => TakeEntity, (course) => course.user_id)
  // active_users: TakeEntity[];

  @OneToMany(() => CommentAndRateEntity, (comment) => comment.user_id)
  my_comments: CommentAndRateEntity[];

  @OneToMany(() => Saved_Organization_Entity, (saved_org) => saved_org.user_id)
  saved_organization: Saved_Organization_Entity[];
}
