import { useWarehouses } from "@/app/(application)/shared/use.shared";
import {
    Home,
    ShoppingBag,
    Settings,
    Boxes,
    Warehouse,
    Recycle,
    Database,
    FlaskConical,
    Flame,
    Replace,
    HeartPulse,
    PrinterCheck,
    BanknoteArrowUp,
    BarChart,
    TruckElectric,
    BarChart2,
    BarChart3,
    BarChart4,
    Store,
    ArrowLeftRight,
    History,
    UploadCloud,
} from "lucide-react";

export type SidebarItemConfig = {
    title: string;
    url?: string;
    icon?: any;
    badge?: number;
    items?: SidebarItemConfig[];
};

export type SidebarGroupConfig = {
    label?: string;
    items: SidebarItemConfig[];
};

export function useSidebarData(): SidebarGroupConfig[] {
    const { data: warehouses } = useWarehouses();
    const fg = warehouses?.filter((warehouse) => warehouse.type === "FINISH_GOODS") || [];
    const rm = warehouses?.filter((warehouse) => warehouse.type === "RAW_MATERIAL") || [];

    return [
        {
            label: "Core",
            items: [
                { title: "Dashboard", url: "/", icon: Home },
                {
                    title: "Master Data",
                    icon: Database,
                    items: [
                        { title: "Gudang", url: "/warehouses", icon: Warehouse },
                        { title: "Toko / Outlet", url: "/outlets", icon: Store },
                        {
                            title: "Finished Good",
                            icon: Boxes,
                            items: [
                                { title: "Daftar FG", url: "/products", icon: Boxes },
                                { title: "Import FG", url: "/products/import", icon: UploadCloud },
                                { title: "Tipe FG", url: "/products/type", icon: Settings },
                                { title: "Ukuran FG", url: "/products/size", icon: Settings },
                                { title: "Satuan FG", url: "/products/unit", icon: Settings },
                            ],
                        },
                        {
                            title: "Raw Material",
                            icon: Recycle,
                            items: [
                                { title: "Daftar RM", url: "/rawmat", icon: Recycle },
                                { title: "Import RM", url: "/rawmat/import", icon: UploadCloud },
                                {
                                    title: "Vendor RM",
                                    url: "/rawmat/suppliers",
                                    icon: TruckElectric,
                                },
                                { title: "Kategori RM", url: "/rawmat/categories", icon: Database },
                                { title: "Satuan RM", url: "/rawmat/units", icon: Database },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            label: "Operations",
            items: [
                {
                    title: "Purchasing",
                    icon: BanknoteArrowUp,
                    items: [
                        { title: "Master Purchase", url: "/purchase", icon: BanknoteArrowUp },
                        { title: "PO Tracking", url: "/po/open", icon: TruckElectric },
                    ],
                },
                {
                    title: "Manufacturing",
                    icon: PrinterCheck,
                    items: [
                        { title: "Batch Produksi", url: "/production", icon: PrinterCheck },
                        { title: "Resep", url: "/recipes", icon: FlaskConical },
                        { title: "BOM", url: "/bom", icon: Flame },
                    ],
                },
                {
                    title: "Inventory",
                    icon: Boxes,
                    items: [
                        { title: "Stock Transfer", url: "/stock-transfers", icon: ArrowLeftRight },
                        { title: "Movement Log", url: "/stock-movements", icon: History },
                        {
                            title: "Stock Finished Good",
                            icon: Boxes,
                            items: [
                                { title: "Rekap Stok", url: "/products/stocks", icon: Database },
                                ...fg.map((warehouse) => ({
                                    title: `${warehouse.name.charAt(0).toUpperCase() + warehouse.name.slice(1).toLowerCase()}`,
                                    url: `/products/stocks/${warehouse.id}`,
                                    icon: Warehouse,
                                })),
                            ],
                        },
                        {
                            title: "Stock Raw Material",
                            icon: Recycle,
                            items: [
                                { title: "Rekap Stok", url: "/rawmat/stocks", icon: Database },
                                ...rm.map((warehouse) => ({
                                    title: `${warehouse.name.charAt(0).toUpperCase() + warehouse.name.slice(1).toLowerCase()}`,
                                    url: `/rawmat/stocks/${warehouse.id}`,
                                    icon: Warehouse,
                                })),
                            ],
                        },
                    ],
                },
                {
                    title: "POS",
                    icon: Store,
                    items: [
                        { title: "Penjualan", url: "/sales", icon: ShoppingBag },
                        { title: "Rekap Sales", url: "/sales/rekap", icon: Boxes },
                        { title: "Analitik Sales", url: "/sales/analytics", icon: BarChart },
                    ],
                },
            ],
        },
        {
            label: "Finance",
            items: [
                {
                    title: "Forecasting",
                    icon: BarChart2,
                    items: [
                        { title: "Master Forecast", url: "/forecasts", icon: BarChart4 },
                        { title: "Display Forecast", url: "/forecasts/display", icon: BarChart3 },
                        { title: "Persentase", url: "/forecasts/percentages", icon: BarChart },
                    ],
                },
                {
                    title: "Rekomendasi",
                    icon: Replace,
                    items: [
                        { title: "FFO", url: "/recomendation-v2/ffo", icon: Replace },
                        { title: "FP Inter", url: "/recomendation-v2/fp-inter", icon: Replace },
                        { title: "FP Local", url: "/recomendation-v2/fp-local", icon: Replace },
                    ],
                },
            ],
        },
        {
            label: "System",
            items: [{ title: "Pengaturan", url: "/settings", icon: Settings }],
        },
    ];
}
