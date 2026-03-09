import { QueryProductInventoryDTO } from "@/app/(application)/warehouses/server/warehouse.schema";

/**
 * Transformasi data dinamis untuk Product & Raw Material
 * Pivot data gudang sehingga setiap baris adalah satu item (Produk/Material)
 * dan setiap gudang adalah satu kolom stok.
 */
export function transformToStockTable(warehouses: any[], type: "FINISH_GOODS" | "RAW_MATERIAL") {
    const map = new Map();

    // Tentukan key berdasarkan tipe data input
    const inventoryKey =
        type === "FINISH_GOODS" ? "product_inventories" : "raw_material_inventories";
    const idKey = type === "FINISH_GOODS" ? "product_id" : "raw_material_id";
    const codeKey = type === "FINISH_GOODS" ? "product_code" : "raw_material_code";
    const nameKey = type === "FINISH_GOODS" ? "product_name" : "raw_material_name";

    warehouses.forEach((warehouse) => {
        warehouse[inventoryKey]?.forEach((item: any) => {
            const id = item[idKey];
            if (!map.has(id)) {
                map.set(id, {
                    id: id,
                    // Pastikan key ini sinkron dengan ColumnDef di WarehouseInventoryColumns
                    product_code: type === "FINISH_GOODS" ? item[codeKey] : undefined,
                    material_code: type === "RAW_MATERIAL" ? item[codeKey] : undefined,
                    product_name: type === "FINISH_GOODS" ? item[nameKey] : undefined,
                    material_name: type === "RAW_MATERIAL" ? item[nameKey] : undefined,
                    gender: type === "FINISH_GOODS" ? item.gender : undefined,
                    type: type === "FINISH_GOODS" ? item.type : undefined,
                    size: type === "FINISH_GOODS" ? item.size : undefined,
                    category: type === "RAW_MATERIAL" ? item.category : undefined,
                    uom: item.uom,
                    total_stock: 0, // Akan dihitung ulang
                    stocks: {},
                });
            }

            const currentItem = map.get(id);
            const stockVal = Number(item.current_stock) || 0;

            currentItem.stocks[warehouse.name] = stockVal;
            currentItem.total_stock += stockVal;
        });
    });
    return Array.from(map.values());
}
