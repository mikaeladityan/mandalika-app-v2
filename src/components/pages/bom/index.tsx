"use client";

import { useMemo, useState } from "react";
import { Search, Loader2, Zap, Download, FilterX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DataTable } from "@/components/ui/table/data";
// Menggunakan Dialog standar Shadcn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    useBOMQuery,
    useBOMTableState,
    useExplodeBOM,
} from "@/app/(application)/bom/server/use.bom";
import { BOMColumns } from "./table/column";
import { toast } from "sonner";

export function BOMManagement() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const table = useBOMTableState();
    const explode = useExplodeBOM();

    const { data, meta, isLoading, isFetching, isRefetching, refetch } = useBOMQuery(
        table.queryParams,
    );

    const isDataLoading = isLoading || isFetching || isRefetching;

    const handleGeneratePlan = async () => {
        setIsConfirmOpen(false);
        try {
            await explode.mutateAsync({});
            toast.success("MPS berhasil diperbarui untuk 6 bulan ke depan");
            refetch();
        } catch (error) {
            toast.error("Gagal memperbarui rencana produksi");
        }
    };

    const groupedData = useMemo(() => {
        if (!data?.data || data.data.length === 0) return [];
        const groups: Record<string, any> = {};

        data.data.forEach((item: any) => {
            const key = item.product_code;
            if (!groups[key]) {
                groups[key] = {
                    product_name: item.product_name,
                    product_code: item.product_code,
                    product_size: item.product_size,
                    materials: [],
                };
            }
            groups[key].materials.push({
                material_name: item.material_name,
                material_code: item.material_code,
                material_unit: item.material_unit,
                monthly_data: item.monthly_data,
                recipes: item.recipes,
            });
        });
        return Object.values(groups);
    }, [data]);

    const monthlyKeys = useMemo(() => {
        if (!data?.data || data.data.length === 0) return [];
        return Object.keys(data.data[0]?.monthly_data || {});
    }, [data]);

    const columns = useMemo(() => BOMColumns(monthlyKeys), [monthlyKeys]);

    return (
        <section className="relative space-y-6 max-w-full">
            {/* OVERLAY LOADING */}
            {explode.isPending && (
                <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center text-center max-w-sm">
                        <div className="relative mb-4">
                            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
                            <Zap className="h-5 w-5 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Mengkalkulasi BOM...</h3>
                        <p className="text-sm text-slate-500 mt-2">
                            Mohon tunggu, sistem sedang menghitung kebutuhan material untuk 6 bulan
                            ke depan secara batching.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Master Production Schedule (MPS)
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Proyeksi kebutuhan material berdasarkan rencana produksi.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                    {/* <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" /> Export
                    </Button> */}
                    <Button
                        onClick={() => setIsConfirmOpen(true)}
                        disabled={explode.isPending || isDataLoading}
                        variant="teal"
                        size="sm"
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Plan
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <InputGroup className="bg-white md:max-w-md rounded-lg shadow-sm border-slate-200">
                            <InputGroupInput
                                placeholder="Cari produk..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                            />
                            <InputGroupAddon>
                                {isFetching ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <Search className="h-4 w-4 text-slate-400" />
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        {table.search && (
                            <Button variant="ghost" size="sm" onClick={() => table.setSearch("")}>
                                <FilterX className="h-4 w-4 mr-2" /> Reset
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    {isDataLoading && !data ? (
                        <div className="p-6 space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 w-full bg-slate-50 animate-pulse rounded-lg"
                                />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={groupedData}
                            page={table.queryParams.page || 1}
                            pageSize={table.queryParams.take || 500}
                            total={meta?.len ?? 0}
                            onPageChange={table.setPage}
                            onPageSizeChange={table.setPageSize}
                            pageLength={[25, 50, 100, 500, 1000]}
                        />
                    )}
                </CardContent>
            </Card>

            {/* DIALOG KONFIRMASI MENGGUNAKAN SHADCN DIALOG */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader className="flex flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-2">
                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                        </div>
                        <DialogTitle className="text-xl">Konfirmasi Generate Plan</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Apakah Anda yakin ingin menghitung ulang kebutuhan material (BOM
                            Explode) untuk <strong>6 bulan ke depan</strong>? <br />
                            <br />
                            Data requirement pada periode tersebut akan diperbarui sesuai rencana
                            produksi terbaru.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row gap-2 sm:justify-center mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmOpen(false)}
                            className="w-full sm:w-28"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleGeneratePlan}
                            className="bg-teal-600 hover:bg-teal-700 w-full sm:w-32 text-white"
                        >
                            Ya, Jalankan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
