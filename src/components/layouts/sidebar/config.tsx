import { useWarehouses } from "@/app/(application)/shared/use.shared";
import {
    Home,
    Users,
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
                { title: "Forecasting (PENDING)", url: "/forecasts", icon: BarChart2 },
                { title: "Safety Stock (PENDING)", url: "/safety-stock", icon: Boxes },
            ],
        },

        {
            label: "Penjualan",
            items: [
                { title: "Penjualan (FG)", url: "/sales", icon: ShoppingBag },
                { title: "Analitik Penjualan", url: "/sales/analytics", icon: BarChart },
            ],
        },

        {
            items: [
                {
                    title: "Produk (FG)",
                    icon: Boxes,
                    items: [
                        { title: "Master FG", url: "/products", icon: Database },
                        // Total Stock
                        { title: "Rekap Stock", url: "/products/stocks", icon: Boxes },
                        // Dinamis Gudang Stock
                        ...fg.map((warehouse) => ({
                            title: warehouse.name.toLocaleLowerCase(),
                            url: `/products/stocks/${warehouse.id}`,
                            icon: Warehouse,
                        })),
                    ],
                },
            ],
        },
        {
            items: [
                {
                    title: "Raw Material",
                    icon: Recycle,
                    items: [
                        { title: "Master RM", url: "/rawmat", icon: Database },
                        // Total Stock
                        { title: "Rekap Stock", url: "/rawmat/stocks", icon: Boxes },
                        // Dinamis Gudang Stock
                        ...rm.map((warehouse) => ({
                            title: warehouse.name.toLocaleLowerCase(),
                            url: `/rawmat/stocks/${warehouse.id}`,
                            icon: Warehouse,
                        })),
                    ],
                },
            ],
        },
        {
            label: "Gudang",
            items: [{ title: "Gudang", url: "/warehouses", icon: Warehouse }],
        },
        {
            label: "Produksi",
            items: [
                { title: "Resep", url: "/recipes", icon: FlaskConical },
                { title: "BOM", url: "/bom", icon: Flame },
            ],
        },

        // {
        //     items: [
        //         {
        //             title: "Produksi",
        //             icon: Boxes,
        //             items: [
        //                 { title: "Material", url: "/rawmat", icon: Boxes },
        //                 { title: "Bom", url: "/bom", icon: GitPullRequestCreateArrow },
        //             ],
        //         },
        //     ],
        // },
        // {
        //     items: [{ title: "Gudang", url: "/warehouses", icon: Warehouse }],
        // },
        {
            label: "Rekomendasi",
            items: [
                {
                    title: "Rekomendasi",
                    icon: Replace,
                    items: [
                        { title: "FFO", url: "/ffo", icon: HeartPulse },
                        { title: "FP LOKAL", url: "/fp-local", icon: PrinterCheck },
                        { title: "FP INTER", url: "/fp-inter", icon: PrinterCheck },
                    ],
                },
            ],
        },
        {
            label: "Purchase",
            items: [
                { title: "Purchase", url: "/purchase", icon: BanknoteArrowUp },
                { title: "PO Open", url: "/po/open", icon: TruckElectric },
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
            items: [
                {
                    title: "Pengaturan",
                    icon: Settings,
                    items: [
                        { title: "Pengaturan Umum", url: "/settings", icon: Settings },
                        { title: "Pengguna", url: "/settings/users", icon: Users },
                        { title: "Roles & Permissions", url: "/settings/roles", icon: Settings },
                    ],
                },
            ],
        },
    ];
}
