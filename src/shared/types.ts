import z from "zod";

export interface ApiSuccessResponse<T = unknown> {
    status: true;
    data: T;
}

export interface Errors {
    path: string | undefined;
    message: string;
}

export const STATUS = ["PENDING", "ACTIVE", "FAVOURITE", "BLOCK", "DELETE"] as const;
export const ROLE = ["STAFF", "SUPER_ADMIN", "OWNER", "DEVELOPER"] as const;
export const GENDER = ["WOMEN", "MEN", "UNISEX"] as const;
export const SALES_TYPE = ["ALL", "OFFLINE", "ONLINE", "SPIN_WHEEL", "GARANSI_OUT"] as const;
export const TRANSFER_STATUS = [
    "PENDING",
    "APPROVED",
    "SHIPMENT",
    "RECEIVED",
    "FULFILLMENT",
    "COMPLETED",
    "PARTIAL",
    "MISSING",
    "REJECTED",
    "CANCELLED",
] as const;
export const TRANSFER_LOCATION_TYPE = ["WAREHOUSE", "OUTLET"] as const;

export const MOVEMENT_TYPE = [
    "IN",
    "OUT",
    "TRANSFER_IN",
    "TRANSFER_OUT",
    "ADJUSTMENT",
    "OPNAME",
    "INITIAL",
    "POS_SALE",
] as const;
export const MOVEMENT_ENTITY_TYPE = ["PRODUCT", "RAW_MATERIAL"] as const;
export const MOVEMENT_LOCATION_TYPE = ["WAREHOUSE", "OUTLET"] as const;
export const MOVEMENT_REF_TYPE = [
    "PURCHASE_ORDER",
    "STOCK_TRANSFER",
    "STOCK_ADJUSTMENT",
    "SALES_TRANSACTION",
    "MANUAL",
] as const;

export const RoleEnumSchema = z.enum(ROLE);
export const StatusEnumSchema = z.enum(STATUS);
export const GenderEnumSchema = z.enum(GENDER);
export const SalesTypeEnumSchema = z.enum(SALES_TYPE);
export const TransferStatusEnumSchema = z.enum(TRANSFER_STATUS);
export const TransferLocationTypeEnumSchema = z.enum(TRANSFER_LOCATION_TYPE);
export const MovementTypeEnumSchema = z.enum(MOVEMENT_TYPE);
export const MovementEntityTypeEnumSchema = z.enum(MOVEMENT_ENTITY_TYPE);
export const MovementLocationTypeEnumSchema = z.enum(MOVEMENT_LOCATION_TYPE);
export const MovementRefTypeEnumSchema = z.enum(MOVEMENT_REF_TYPE);

export type RoleEnumDTO = z.infer<typeof RoleEnumSchema>;
export type StatusEnumDTO = z.infer<typeof StatusEnumSchema>;
export type GenderEnumDTO = z.infer<typeof GenderEnumSchema>;
export type SalesTypeEnumDTO = z.infer<typeof SalesTypeEnumSchema>;

export type ImportPreviewResponseDTO = {
    total: number;
    valid: number;
    invalid: number;
    preview: any[];
    errors: {
        row: number;
        error: any;
    }[];
};
export type RedisProduct = {
    id: number;
    code: string;
    name: string;
    type?: string;
    size: string;
};

export type RedisRawMaterial = {
    id: number;
    name: string;
};
