export declare class CreateSubscriptionDto {
    plan: 'BASE' | 'MOYENNE' | 'SEMESTRIELLE' | 'SUPREME';
    companyId: string;
    amount: number;
    currency: string;
    paymentMethod?: 'CASH' | 'CARD' | 'MOBILE_MONEY';
    aggregator?: 'KKIAPAY' | 'MONEROO' | 'CINETPAY';
}
