"use client";

import { useParams } from "next/navigation";
import { Loader2, Warehouse, MapPin, Calendar, ArrowLeft, Info, Home, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWarehouse } from "@/app/(application)/warehouses/server/use.warehouse";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function DetailWarehouse() {
    const { id } = useParams();

    const { detail, isLoading } = useWarehouse(undefined, Number(id));

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin size-12 text-primary" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Memuat data gudang...</p>
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted-foreground">Data gudang tidak ditemukan.</p>
                <Button onClick={() => window.history.back()}>Kembali</Button>
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.history.back()}
                            className="rounded-full h-8 w-8"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Detail Gudang: {detail.name}
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">
                        Informasi lengkap mengenai lokasi dan status gudang pilihan.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge
                        variant="secondary"
                        className={`px-3 py-1 uppercase text-[10px] tracking-wider font-bold ${
                            detail.type === "FINISH_GOODS"
                                ? "bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"
                        }`}
                    >
                        {detail.type === "FINISH_GOODS" ? "Produk Jadi" : "Bahan Baku"}
                    </Badge>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <Card className="lg:col-span-2 border-none pt-0 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="border-b bg-white pt-4">
                        <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                            <Info className="size-4 text-primary" />
                            Informasi Utama
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">
                                    Nama Gudang
                                </p>
                                <p className="text-lg font-semibold">{detail.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">
                                    Tipe Penyimpanan
                                </p>
                                <p className="text-lg font-semibold">
                                    {detail.type === "FINISH_GOODS"
                                        ? "Gudang Barang Jadi"
                                        : "Gudang Bahan Baku"}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="size-4 text-rose-500" />
                                <h3 className="font-bold">Lokasi & Alamat</h3>
                            </div>

                            {detail.warehouse_address ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                                                <Home className="size-3" /> Alamat Jalan
                                            </p>
                                            <p className="text-sm leading-relaxed">
                                                {detail.warehouse_address.street}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase">
                                                Area
                                            </p>
                                            <p className="text-sm">
                                                {detail.warehouse_address.sub_district},{" "}
                                                {detail.warehouse_address.district}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase">
                                                Kota & Provinsi
                                            </p>
                                            <p className="text-sm">
                                                {detail.warehouse_address.city},{" "}
                                                {detail.warehouse_address.province}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                                                <Globe className="size-3" /> Kode Pos & Negara
                                            </p>
                                            <p className="text-sm">
                                                {detail.warehouse_address.postal_code},{" "}
                                                {detail.warehouse_address.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic p-4 bg-slate-50 rounded-lg">
                                    Informasi alamat belum ditambahkan.
                                </p>
                            )}

                            {detail.warehouse_address?.notes && (
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                                    <p className="font-semibold mb-1">Catatan Tambahan:</p>
                                    {detail.warehouse_address.notes}
                                </div>
                            )}

                            {detail.warehouse_address?.url_google_maps && (
                                <Button variant="outline" className="w-full md:w-auto" asChild>
                                    <a
                                        href={detail.warehouse_address.url_google_maps}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MapPin className="mr-2 h-4 w-4" /> Buka di Google Maps
                                    </a>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                        <CardHeader className="border-b">
                            <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                                <Calendar className="size-4 text-blue-500" />
                                Jejak Waktu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">
                                    Dibuat Pada
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(detail.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">
                                    Update Terakhir
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(detail.updated_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-slate-900 text-white">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-white/10 rounded-full">
                                    <Warehouse size={48} className="text-teal-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Kapasitas Gudang</h3>
                                <p className="text-sm text-slate-400">
                                    Pencatatan stok untuk gudang ini dilakukan melalui modul
                                    Inventori pusat.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full border-slate-700 hover:bg-slate-800 text-white cursor-not-allowed"
                                disabled
                            >
                                Lihat Inventori Terkait
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
