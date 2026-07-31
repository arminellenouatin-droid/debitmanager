import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductType } from './product-type.entity';
import { Unit } from './unit.entity';
import { PriceHistory } from './price-history.entity';

@Entity('products')
@Index(['tenantId'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column({ length: 120 })
  name: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'type_id' })
  typeId: string;

  @Column({ name: 'unit_id' })
  unitId: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'current_stock', type: 'integer' })
  currentStock: number;

  @Column({ name: 'alert_threshold', type: 'integer' })
  alertThreshold: number;

  @Column({ name: 'safety_threshold', type: 'integer' })
  safetyThreshold: number;

  @Column({ name: 'min_stock_threshold', type: 'integer', default: 5 })
  minStockThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: 'type_id' })
  type: ProductType;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @OneToMany(() => PriceHistory, (priceHistory) => priceHistory.product)
  priceHistory: PriceHistory[];
}
