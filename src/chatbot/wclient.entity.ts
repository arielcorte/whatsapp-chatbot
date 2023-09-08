import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wclient {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ default: 'created' })
  status: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 0 })
  messageCount: number;

  @Column()
  flowiseUrl: string;

  @Column()
  flowiseKey: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
