export declare class CreateOrderDto {
    tableId?: string;
    orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
    }[];
    notes?: string;
    customerPhone?: string;
}
