export declare enum PaymentPurpose {
    ORDER = "ORDER",
    SUBSCRIPTION = "SUBSCRIPTION",
    PAYROLL = "PAYROLL"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    MOBILE_MONEY = "MOBILE_MONEY"
}
export declare enum PaymentAggregator {
    KKIAPAY = "KKIAPAY",
    MONEROO = "MONEROO",
    CINETPAY = "CINETPAY",
    NONE = "NONE"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare class Payment {
    id: string;
    tenantId: string;
    paymentPurpose: PaymentPurpose;
    referenceId: string;
    amount: number;
    method: PaymentMethod;
    aggregator: PaymentAggregator;
    aggregatorReference: string;
    platformCommissionAmount: number;
    status: PaymentStatus;
    webhookReceivedAt: Date;
    reconciled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
