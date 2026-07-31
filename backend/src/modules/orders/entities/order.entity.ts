import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Table } from '../../tables/entities/table.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum OrderSource {
  SERVER = 'SERVER',
  QR_CLIENT = 'QR_CLIENT',
}

@Entity('orders')
@Index(['tenantId'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'table_id', nullable: true })
  tableId: string;

  @Column({ name: 'server_user_id' })
  serverUserId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderSource,
    default: OrderSource.SERVER,
  })
  source: OrderSource;

  @Column({ default: false, name: 'offline_created' })
  offlineCreated: boolean;

  @Column({ name: 'client_generated_id' })
  clientGeneratedId: string;

  @Column({ nullable: true, length: 255, name: 'cancelled_reason' })
  cancelledReason: string;

  @Column({ nullable: true, name: 'cancelled_by_user_id' })
  cancelledByUserId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Table, { nullable: true })
  @JoinColumn({ name: 'table_id' })
  table?: Table;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}
