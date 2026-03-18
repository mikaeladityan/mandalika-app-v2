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
            label: "Utama",
            items: [
                { title: "Dashboard", url: "/", icon: Home },
                {
                    title: "Forecasting",
                    url: "/",
                    icon: BarChart2,
                    items: [
                        { title: "Master", url: "/forecasts", icon: BarChart4 },
                        { title: "Display", url: "/forecasts/display", icon: BarChart3 },
                        { title: "Percentages", url: "/forecasts/percentages", icon: BarChart },
                    ],
                },
            ],
        },
        {
            label: "Inventory",
            items: [
                {
                    title: "Produk (FG)",
                    icon: Boxes,
                    items: [
                        { title: "Master FG", url: "/products", icon: Database },
                        { title: "Rekap Stock", url: "/products/stocks", icon: Boxes },
                        ...fg.map((warehouse) => ({
                            title: warehouse.name.toLocaleLowerCase(),
                            url: `/products/stocks/${warehouse.id}`,
                            icon: Warehouse,
                        })),
                    ],
                },
                {
                    title: "Raw Material",
                    icon: Recycle,
                    items: [
                        { title: "Master RM", url: "/rawmat", icon: Database },
                        { title: "Rekap Stock", url: "/rawmat/stocks", icon: Boxes },
                        ...rm.map((warehouse) => ({
                            title: warehouse.name.toLocaleLowerCase(),
                            url: `/rawmat/stocks/${warehouse.id}`,
                            icon: Warehouse,
                        })),
                    ],
                },
                { title: "Gudang", url: "/warehouses", icon: Warehouse },
            ],
        },
        {
            label: "Operational",
            items: [
                {
                    title: "Pengeluaran (FG)",
                    icon: ShoppingBag,
                    items: [
                        { title: "Master", url: "/sales?type=ALL", icon: Database },
                        { title: "Rekap", url: "/sales/rekap", icon: Boxes },
                        { title: "Offline", url: "/sales?type=OFFLINE", icon: ShoppingBag },
                        { title: "Online", url: "/sales?type=ONLINE", icon: ShoppingBag },
                        { title: "Spin Wheel", url: "/sales?type=SPIN_WHEEL", icon: ShoppingBag },
                        { title: "Garansi Out", url: "/sales?type=GARANSI_OUT", icon: ShoppingBag },
                    ],
                },
                { title: "Analitik Sales", url: "/sales/analytics", icon: BarChart },
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
            label: "Purchase & Production",
            items: [
                { title: "Purchase", url: "/purchase", icon: BanknoteArrowUp },
                { title: "PO Tracking", url: "/po/open", icon: TruckElectric },
                { title: "Batch Produksi", url: "/production", icon: PrinterCheck },
                { title: "Resep", url: "/recipes", icon: FlaskConical },
                { title: "BOM", url: "/bom", icon: Flame },
            ],
        },
        // {
        //     items: [
        //         {
        //             title: "PO",
        //             icon: ReceiptText,
        //             items: [
        //                 { title: "Order", url: "/po", icon: ShoppingCart },
        //                 { title: "Supplier", url: "/rawmat/suppliers", icon: Truck },
        //                 { title: "Laporan", url: "/po/keuangan", icon: FileText },
        //             ],
        //         },
        //     ],
        // },
        {
            items: [{ title: "Pengaturan", url: "/settings", icon: Settings }],
        },
    ];
}
