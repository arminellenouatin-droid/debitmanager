export declare class CreateTableDto {
    name: string;
    capacity: number;
    status?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
    location?: string;
}
