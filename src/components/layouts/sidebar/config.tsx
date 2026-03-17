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
                    ],
                },
                // { title: "Safety Stock (PENDING)", url: "/safety-stock", icon: Boxes },
            ],
        },

        {
            label: "Pengeluaran",
            items: [
                {
                    title: "Pengeluaran (FG)",
                    icon: ShoppingBag,
                    items: [
                        { title: "Master Pengeluaran", url: "/sales", icon: Database },
                        // Total Stock
                        { title: "Rekap Pengeluaran", url: "/sales/rekap", icon: Boxes },
                    ],
                },
                { title: "Analitik Pengeluaran", url: "/sales/analytics", icon: BarChart },
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
        // {
        //     label: "Rekomendasi",
        //     items: [
        //         {
        //             title: "Rekomendasi",
        //             icon: Replace,
        //             items: [
        //                 { title: "FFO", url: "/recomendation/ffo", icon: HeartPulse },
        //                 { title: "FP LOKAL", url: "/recomendation/fp-local", icon: PrinterCheck },
        //                 { title: "FP INTER", url: "/recomendation/fp-inter", icon: PrinterCheck },
        //             ],
        //         },
        //     ],
        // },

        {
            label: "Rekomendasi (PPIC)",
            items: [
                {
                    title: "Rekomendasi V2",
                    icon: Replace,
                    items: [
                        { title: "FFO", url: "/recomendation-v2/ffo", icon: HeartPulse },
                        {
                            title: "FP LOKAL",
                            url: "/recomendation-v2/fp-local",
                            icon: PrinterCheck,
                        },
                        {
                            title: "FP INTER",
                            url: "/recomendation-v2/fp-inter",
                            icon: PrinterCheck,
                        },
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
