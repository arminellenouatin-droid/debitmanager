import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    id: string;
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    ipAddress: string;
    metadata: Record<string, any>;
    createdAt: Date;
    user: User;
}
