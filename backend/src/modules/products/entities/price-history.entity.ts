import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('price_history')
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ name: 'cost_price', type: 'integer', default: 0 })
  costPrice: number;

  @Column({ name: 'changed_by_user_id' })
  changedBy: string;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;

  @ManyToOne(() => Product, (product) => product.priceHistory)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
