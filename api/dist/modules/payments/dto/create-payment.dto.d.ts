export declare class CreatePaymentDto {
    paymentPurpose: 'ORDER' | 'SUBSCRIPTION' | 'PAYROLL';
    referenceId: string;
    amount: number;
    currency: string;
    method: 'CASH' | 'CARD' | 'MOBILE_MONEY';
    aggregator?: 'KKIAPAY' | 'MONEROO' | 'CINETPAY' | 'NONE';
    phone?: string;
    cardToken?: string;
}
