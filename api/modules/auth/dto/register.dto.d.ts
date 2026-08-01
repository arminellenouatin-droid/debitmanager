export declare class RegisterDto {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
    userType: 'TENANT_STAFF' | 'SUPER_ADMIN' | 'AFFILIATE';
}
