import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wclient {
  @PrimaryColumn()
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
