import { Product } from './product.entity';
export declare class PriceHistory {
    id: string;
    tenantId: string;
    productId: string;
    price: number;
    costPrice: number;
    changedBy: string;
    changedAt: Date;
    product: Product;
}
