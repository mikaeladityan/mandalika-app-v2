"use client";

import { useActionProduct, useProduct } from "@/app/(application)/products/server/use.products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ParseDate } from "@/lib/utils";
import {
    ArrowLeft,
    Calendar,
    Clock,
    CloudBackup,
    Loader2,
    Package,
    Trash2,
    Tag,
    Users,
    Ruler,
    BarChart3,
    Clock4,
    RefreshCw,
    AlertTriangle,
    Edit2,
    Shield,
    Beaker,
    Coins,
    Warehouse,
    Boxes,
    Database,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DetailProduct() {
    const { id } = useParams();
    const { product, isError, isFetching, isLoading, isRefetching, refetch } = useProduct(
        undefined,
        Number(id),
    );
    const { changeStatus } = useActionProduct();

    const handleDeleted = async (id: number) => {
        await changeStatus.mutateAsync({ id, status: "DELETE" });
    };

    const handleRestored = async (id: number) => {
        await changeStatus.mutateAsync({ id, status: "ACTIVE" });
    };

    const isBusy = isLoading || isFetching || isRefetching;

    if (isBusy) {
        return <DetailProductSkeleton />;
    }

    if (isError || !product) {
        return <DetailProductError onRetry={refetch} />;
    }

    const isDeleted = product?.status === "DELETE";
    const isActive = product?.status === "ACTIVE";

    const getGenderText = (gender: string) => {
        const map: Record<string, string> = {
            WOMEN: "Wanita",
            MEN: "Pria",
            UNISEX: "Unisex",
        };
        return map[gender] || gender;
    };

    // Hitung total biaya produksi dari resep
    const totalProductionCost = product.recipes?.reduce(
        (acc: number, item: any) => acc + item.quantity * item.raw_material.price,
        0,
    );

    // Hitung total stok dari semua gudang
    const totalStock = product.product_inventories?.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0,
    );

    return (
        <div className="w-full space-y-6 pb-10">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    size="sm"
                    onClick={() => window.history.back()}
                    variant="ghost"
                    className="hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
                <div className="flex items-center gap-2">
                    {/* <Button size="sm"  asChild >
                        <Link href={`/products/${product?.id}/edit`}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button> */}
                    <Button
                        size="sm"
                        onClick={() => refetch()}
                        variant="outline"
                        disabled={isRefetching}
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
                        />
                        Sinkron
                    </Button>
                </div>
            </div>

            {/* Hero Header Section */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {product?.name}
                            </h1>
                            <Badge
                                variant={isDeleted ? "destructive" : "outline"}
                                className={
                                    isActive
                                        ? "border-green-500 text-green-700 bg-green-50 px-3 py-1"
                                        : "px-3 py-1"
                                }
                            >
                                {isActive && <Shield className="h-3 w-3 mr-1" />}
                                {product?.status}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Tag className="h-4 w-4 text-blue-500" />
                                <span className="font-mono">{product?.code}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Package className="h-4 w-4 text-orange-500" />
                                {product?.product_type?.name?.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-pink-500" />
                                {getGenderText(product?.gender || "")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full md:w-[450px] grid-cols-3 mb-4">
                    <TabsTrigger value="info">Informasi Umum</TabsTrigger>
                    <TabsTrigger value="recipes">
                        Resep & BOM
                        <Badge className="ml-2 bg-primary/10 text-primary border-none h-5 px-1.5 min-w-5 justify-center">
                            {product?.recipes?.length || 0}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="inventory">
                        Stok
                        <Badge className="ml-2 bg-slate-100 text-slate-600 border-none h-5 px-1.5 min-w-5 justify-center">
                            {totalStock || 0}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left & Middle Column (Content) */}
                    <div className="lg:col-span-2 space-y-6">
                        <TabsContent value="info" className="mt-0 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        Parameter Produksi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem
                                            icon={Ruler}
                                            label="Ukuran"
                                            value={`${product?.size?.size} ${product?.unit?.name}`}
                                            color="blue"
                                        />
                                        <InfoItem
                                            icon={Shield}
                                            label="Safety Factor (Z)"
                                            value={product?.z_value?.toString() || "-"}
                                            color="purple"
                                            tooltip="Tingkat keamanan stok"
                                        />
                                        <InfoItem
                                            icon={Clock4}
                                            label="Lead Time"
                                            value={`${product?.lead_time} Hari`}
                                            color="orange"
                                        />
                                        <InfoItem
                                            icon={RefreshCw}
                                            label="Review Period"
                                            value={`${product?.review_period} Hari`}
                                            color="cyan"
                                        />
                                        <InfoItem
                                            icon={Shield}
                                            label="Safety Stock (%)"
                                            value={`${product?.safety_percentage || 0}%`}
                                            color="orange"
                                            tooltip="Persentase stok cadangan"
                                        />
                                        <InfoItem
                                            icon={BarChart3}
                                            label="Distribusi (%)"
                                            value={`${product?.distribution_percentage || 0}%`}
                                            color="blue"
                                            tooltip="Persentase distribusi produk"
                                        />
                                    </div>

                                    {product?.description && (
                                        <div className="mt-8 pt-6 border-t border-slate-100">
                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Deskripsi Produk</h4>
                                            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
                                                "{product.description}"
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Audit Sistem</CardTitle>
                                    <CardDescription>Jejak waktu data produk</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <MetaItem
                                            icon={Calendar}
                                            label="Dibuat"
                                            value={ParseDate(product.created_at)}
                                            type="created"
                                        />
                                        <MetaItem
                                            icon={Clock}
                                            label="Terakhir Update"
                                            value={ParseDate(product.updated_at)}
                                            type="updated"
                                        />
                                        {isDeleted && (
                                            <MetaItem
                                                icon={Trash2}
                                                label="Dihapus"
                                                value={ParseDate(product.deleted_at!)}
                                                type="deleted"
                                            />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="recipes" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Beaker className="h-5 w-5 text-primary" />
                                        Bill of Materials (BOM)
                                    </CardTitle>
                                    <CardDescription>
                                        Formula bahan baku yang dibutuhkan untuk memproduksi 1 unit {product.name}.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 border-y text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                                                <tr>
                                                    <th className="text-left py-4 px-6">Material</th>
                                                    <th className="text-center py-4 px-4">Jumlah / Qty</th>
                                                    <th className="text-right py-4 px-4">Harga Satuan</th>
                                                    <th className="text-right py-4 px-6">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {product.recipes?.map((item: any, idx: number) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-slate-50/80 transition-colors group"
                                                    >
                                                        <td className="py-4 px-6">
                                                            <Link
                                                                href={`/rawmat/${item.raw_material.id}`}
                                                                className="hover:underline underline-offset-4"
                                                            >
                                                                <div className="font-bold text-slate-900">
                                                                    {item.raw_material.name}
                                                                </div>
                                                                <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                                                    <Database className="h-3 w-3" />
                                                                    Global Stock: {item.raw_material.current_stock ?? 0}
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <Badge
                                                                variant="outline"
                                                                className="font-mono bg-white shadow-sm border-slate-200"
                                                            >
                                                                {item.quantity}{" "}
                                                                {item.raw_material.unit_raw_material.name}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-4 text-right text-slate-600 font-medium tabular-nums">
                                                            Rp {item.raw_material.price.toLocaleString("id-ID")}
                                                        </td>
                                                        <td className="py-4 px-6 text-right font-black text-slate-900 tabular-nums">
                                                            Rp {(item.quantity * item.raw_material.price).toLocaleString("id-ID")}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!product.recipes || product.recipes.length === 0) && (
                                                    <tr>
                                                        <td
                                                            colSpan={4}
                                                            className="py-16 text-center"
                                                        >
                                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                                <Boxes className="h-10 w-10 opacity-20" />
                                                                <p className="text-sm font-medium">BOM Belum Dikonfigurasi</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                                {product.recipes?.length > 0 && (
                                    <CardFooter className="bg-slate-900 py-6 justify-between border-t border-slate-800 rounded-b-xl px-8">
                                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                                            <Coins className="h-4 w-4 text-yellow-500" />
                                            Cost Calculation
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                                                Estimasi Modal BOM:
                                            </span>
                                            <span className="text-2xl font-black text-white tabular-nums">
                                                Rp {totalProductionCost?.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </CardFooter>
                                )}
                            </Card>
                        </TabsContent>

                        <TabsContent value="inventory" className="mt-0">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Warehouse className="h-5 w-5 text-primary" />
                                            Ketersediaan Stok
                                        </CardTitle>
                                        <CardDescription>
                                            Jumlah stok fisik {product.name} di setiap gudang.
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total On-Hand</p>
                                        <p className="text-2xl font-black text-primary">{totalStock} {product.unit?.name}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 border-y text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                                                <tr>
                                                    <th className="text-left py-4 px-6 text-slate-500 border-r border-slate-100">Gudang / Lokasi</th>
                                                    <th className="text-center py-4 px-4">Status</th>
                                                    <th className="text-right py-4 px-4">Min. Stok</th>
                                                    <th className="text-right py-4 px-6">Quantity Tersedia</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {product.product_inventories?.map((inv: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-100">
                                                            {inv.warehouse.name}
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            {inv.quantity <= (inv.min_stock || 0) ? (
                                                                <Badge variant="destructive" className="h-5 text-[10px] font-bold">LOW STOCK</Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="h-5 text-[10px] font-bold text-green-600 border-green-200 bg-green-50">NORMAL</Badge>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-4 text-right text-slate-400 font-medium italic">
                                                            {inv.min_stock || 0} {product.unit?.name}
                                                        </td>
                                                        <td className="py-4 px-6 text-right">
                                                            <span className={`text-lg font-black tabular-nums ${inv.quantity <= (inv.min_stock || 0) ? 'text-destructive' : 'text-slate-900'}`}>
                                                                {inv.quantity}
                                                            </span>
                                                            <span className="ml-1 text-xs text-slate-400 font-bold uppercase">{product.unit?.name}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!product.product_inventories || product.product_inventories.length === 0) && (
                                                    <tr>
                                                        <td colSpan={4} className="py-16 text-center text-slate-400">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Boxes className="h-10 w-10 opacity-20" />
                                                                <p className="text-sm">Data stok tidak ditemukan di gudang manapun.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <Card
                            className={
                                isDeleted ? "border-amber-200 bg-amber-50/30" : "border-slate-200"
                            }
                        >
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Tindakan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isDeleted ? (
                                    <Alert className="bg-amber-100 border-amber-200 py-3">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                        <AlertDescription className="text-amber-800 text-xs">
                                            Status dihapus. Beberapa fitur mungkin dibatasi hingga
                                            di-restore.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
                                        <Shield className="h-4 w-4" />
                                        Produk aktif dan valid.
                                    </div>
                                )}
                                <Link
                                    href={`/products/${product.id}/edit`}
                                    className="w-full block"
                                >
                                    <Button
                                        size="sm"
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Produk
                                    </Button>
                                </Link>
                                <div className="space-y-2">
                                    {isDeleted ? (
                                        <Button
                                            size="sm"
                                            onClick={() => handleRestored(product.id)}
                                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                                            disabled={changeStatus.isPending}
                                        >
                                            {changeStatus.isPending ? (
                                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            ) : (
                                                <CloudBackup className="mr-2 h-4 w-4" />
                                            )}
                                            Restore Produk
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() => handleDeleted(product.id)}
                                            variant="outline"
                                            className="w-full text-destructive border-destructive/20 hover:bg-destructive hover:text-white"
                                            disabled={changeStatus.isPending}
                                        >
                                            {changeStatus.isPending ? (
                                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            ) : (
                                                <Trash2 className="mr-2 h-4 w-4" />
                                            )}
                                            Hapus Produk
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Coins className="h-5 w-5 text-yellow-500" /> Ringkasan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant="outline">{product.status}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Total Material</span>
                                    <span className="font-bold">
                                        {product.recipes?.length || 0} Item
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Total Stok</span>
                                    <span className={`${totalStock === 0 ? 'text-destructive' : 'text-slate-900'} font-bold`}>
                                        {totalStock || 0} {product.unit?.name}
                                    </span>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        Harga Pokok Produksi (HPP)
                                    </p>
                                    <p className="text-2xl font-black tracking-tight text-slate-900 tabular-nums">
                                        Rp {totalProductionCost?.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value, color, tooltip }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
        orange: "bg-orange-50 text-orange-700 border-orange-100",
        cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    };

    return (
        <div
            className={`p-4 rounded-xl border flex items-start gap-4 transition-all hover:shadow-md ${colors[color] || "bg-slate-50 border-slate-100"}`}
        >
            <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
                <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70 flex items-center gap-1">
                    {label}
                    {tooltip && <AlertTriangle className="h-3 w-3 inline cursor-help" />}
                </p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

function MetaItem({ icon: Icon, label, value, type }: any) {
    const styles: any = {
        created: "bg-blue-50 text-blue-600 border-blue-100",
        updated: "bg-green-50 text-green-600 border-green-100",
        deleted: "bg-red-50 text-red-600 border-red-100",
    };

    return (
        <div className={`flex flex-col gap-2 p-4 rounded-lg border transition-all ${styles[type]}`}>
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">{label}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function DetailProductSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-75 w-full" />
                    <Skeleton className="h-50 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-50 w-full" />
                    <Skeleton className="h-37.5 w-full" />
                </div>
            </div>
        </div>
    );
}

export function DetailProductError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="max-w-md w-full border-destructive/20 shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-xl">Gagal Memuat Produk</CardTitle>
                    <CardDescription>
                        Data tidak ditemukan atau terjadi gangguan pada server.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-3">
                    <Button size="sm" onClick={onRetry} className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" /> Coba Lagi
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => window.history.back()}
                        variant="ghost"
                        className="w-full"
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
