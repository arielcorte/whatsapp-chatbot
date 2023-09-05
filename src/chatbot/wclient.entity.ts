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

  @Column()
  name: string;

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

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
