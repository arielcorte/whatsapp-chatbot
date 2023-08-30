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
  id!: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 'created' })
  status: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 0 })
  messageCount: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
