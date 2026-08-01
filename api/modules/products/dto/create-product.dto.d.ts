export declare class CreateProductDto {
    name: string;
    description?: string;
    categoryId: string;
    productTypeId: string;
    unitId: string;
    price: number;
    costPrice?: number;
    stockQuantity?: number;
    minStockThreshold?: number;
    isActive?: boolean;
    imageUrl?: string;
}
