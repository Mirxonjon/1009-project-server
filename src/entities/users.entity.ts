import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentAndRateEntity } from './comment_and_rate';
import { SavedOrganizationEntity } from './saved_org.entity';
import { OrganizationEntity } from './organization.entity';

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

  @Column({
    type: 'character varying',
    nullable: true,
  })
  image_link: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  sms_code: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  otp_duration: Date;

  @Column({
    type: 'int',
    nullable: true,
    default: 0,
  })
  attempt: number;

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToMany(() => CommentAndRateEntity, (comment) => comment.user_id)
  my_comments: CommentAndRateEntity[];

  @OneToMany(() => SavedOrganizationEntity, (saved_org) => saved_org.user_id)
  saved_organization: SavedOrganizationEntity[];

  @OneToMany(() => OrganizationEntity, (org) => org.userId)
  my_organization: OrganizationEntity[];
}
