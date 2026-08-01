import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
export declare enum OrderItemStatus {
    PENDING = "PENDING",
    IN_PREPARATION = "IN_PREPARATION",
    READY = "READY"
}
export declare enum OrderSection {
    BAR = "BAR",
    KITCHEN = "KITCHEN"
}
export declare class OrderItem {
    id: string;
    tenantId: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    section: OrderSection;
    assignedToUserId: string;
    status: OrderItemStatus;
    totalPrice: number;
    order: Order;
    product: Product;
}
