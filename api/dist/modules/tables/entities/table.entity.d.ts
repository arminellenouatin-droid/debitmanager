export declare enum TableStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED",
    TO_CLEAN = "TO_CLEAN"
}
export declare class Table {
    id: string;
    tenantId: string;
    number: string;
    name: string;
    capacity: number;
    status: TableStatus;
    qrOrderEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
