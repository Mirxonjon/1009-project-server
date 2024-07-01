import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { UsersEntity } from './users.entity';

@Entity()
export class CommentAndRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'integer',
  })
  rate: number;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  comment: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.comments)
  organization_id: OrganizationEntity;

  @ManyToOne(() => UsersEntity, (user) => user.my_comments)
  user_id: UsersEntity;

  @UpdateDateColumn({ name: 'updated_at' })
  update_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
