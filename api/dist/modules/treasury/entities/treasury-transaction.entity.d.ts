export declare enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
    TRANSFER = "TRANSFER"
}
export declare class TreasuryTransaction {
    id: string;
    tenantId: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    reference: string;
    relatedOrderId: string;
    transactionDate: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
