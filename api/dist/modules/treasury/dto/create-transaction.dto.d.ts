export declare class CreateTransactionDto {
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
    amount: number;
    description: string;
    category?: string;
    reference?: string;
    relatedOrderId?: string;
    transactionDate?: Date;
}
