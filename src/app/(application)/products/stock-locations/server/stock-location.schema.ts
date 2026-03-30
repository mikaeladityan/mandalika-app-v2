export interface QueryStockLocationDTO {
    page?: number;
    take?: number;
    search?: string;
    sortBy?: "name" | "code" | "type" | "size" | "gender" | "updated_at" | "total_stock";
    sortOrder?: "asc" | "desc";
    type_id?: number;
    gender?: string;
}

export interface ResponseStockLocationDTO {
    code: string;
    name: string;
    type: string;
    size: number;
    gender: string;
    uom: string;
    total_stock: number;
    location_stocks: Record<string, number>;
}
