export interface User {
  id: string;
  tenantId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  userType: 'TENANT_STAFF' | 'SUPER_ADMIN' | 'AFFILIATE';
  status: 'PENDING_VALIDATION' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  twoFactorEnabled: boolean;
}

export interface Company {
  id: string;
  tenantId: string;
  name: string;
  activityType: 'BUVETTE' | 'BAR_RESTAURANT' | 'NIGHTCLUB_LOUNGE';
  uniqueCode: string;
  country: string;
  currency: string;
  language: string;
  logoUrl?: string;
  address?: string;
  status: 'TRIAL' | 'ACTIVE' | 'GRACE_PERIOD' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  trialEndsAt?: Date;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  categoryId: string;
  typeId: string;
  unitId: string;
  price: number;
  imageUrl?: string;
  currentStock: number;
  alertThreshold: number;
  safetyThreshold: number;
}

export interface Order {
  id: string;
  tenantId: string;
  tableId?: string;
  serverUserId: string;
  status: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'PAID' | 'CANCELLED';
  source: 'SERVER' | 'QR_CLIENT';
  offlineCreated: boolean;
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  section: 'BAR' | 'KITCHEN';
  status: 'PENDING' | 'IN_PREPARATION' | 'READY';
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    perPage: number;
  };
}
