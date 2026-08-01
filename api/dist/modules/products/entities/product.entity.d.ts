import { Category } from './category.entity';
import { ProductType } from './product-type.entity';
import { Unit } from './unit.entity';
import { PriceHistory } from './price-history.entity';
export declare class Product {
    id: string;
    tenantId: string;
    name: string;
    categoryId: string;
    typeId: string;
    unitId: string;
    price: number;
    imageUrl: string;
    currentStock: number;
    alertThreshold: number;
    safetyThreshold: number;
    minStockThreshold: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    category: Category;
    type: ProductType;
    unit: Unit;
    priceHistory: PriceHistory[];
}
