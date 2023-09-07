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
  id: string;

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

  @Column({ nullable: true })
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
