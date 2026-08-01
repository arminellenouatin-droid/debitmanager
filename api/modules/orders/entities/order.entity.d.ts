import { Table } from '../../tables/entities/table.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "PENDING",
    IN_PREPARATION = "IN_PREPARATION",
    READY = "READY",
    DELIVERED = "DELIVERED",
    PAID = "PAID",
    CANCELLED = "CANCELLED"
}
export declare enum OrderSource {
    SERVER = "SERVER",
    QR_CLIENT = "QR_CLIENT"
}
export declare class Order {
    id: string;
    tenantId: string;
    tableId: string;
    serverUserId: string;
    status: OrderStatus;
    source: OrderSource;
    offlineCreated: boolean;
    clientGeneratedId: string;
    cancelledReason: string;
    cancelledByUserId: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    table?: Table;
    items: OrderItem[];
}
