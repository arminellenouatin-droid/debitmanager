export declare class CreateEmployeeDto {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    role: 'SERVER' | 'BARTENDER' | 'COOK' | 'CLEANER' | 'SECURITY' | 'MANAGER';
    hourlyRate?: number;
    address?: string;
    hireDate?: Date;
}
