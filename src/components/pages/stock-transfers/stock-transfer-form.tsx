"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Package,
    Trash2,
    Plus,
    Store,
    Warehouse,
    Barcode,
    FileText,
    Loader2,
    MoveRight,
    MoveDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    RequestStockTransferSchema,
    RequestStockTransferDTO,
} from "@/app/(application)/stock-transfers/server/stock-transfer.schema";
import { useActionStockTransfer } from "@/app/(application)/stock-transfers/server/use.stock-transfer";
import { useWarehouseStatic } from "@/app/(application)/warehouses/server/use.warehouse";
import { useOutlets } from "@/app/(application)/outlets/server/use.outlet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectForm } from "@/components/ui/form/select";
import { ProductSelect } from "@/components/shared/product-select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo } from "react";
import { useStockCheck } from "@/shared/hooks/use.stock-check";
import { cn } from "@/lib/utils";

function StockCheckCell({
    productId,
    locationType,
    locationId,
}: {
    productId: number;
    locationType: "WAREHOUSE" | "OUTLET" | undefined;
    locationId: number | undefined;
}) {
    const { data: stock, isLoading } = useStockCheck(productId, locationType, locationId);

    if (!productId || !locationType || !locationId)
        return <span className="text-[10px] text-slate-300 italic">Pilih lokasi...</span>;
    if (isLoading) return <Loader2 className="h-3 w-3 animate-spin text-slate-300 mx-auto" />;

    return (
        <div className="flex flex-col items-center">
            <span
                className={cn(
                    "font-bold text-xs tabular-nums",
                    stock?.quantity === 0 ? "text-rose-500" : "text-slate-700",
                )}
            >
                {stock?.quantity ?? 0}
            </span>
        </div>
    );
}

export function StockTransferForm() {
    const router = useRouter();
    const { create } = useActionStockTransfer();

    const { data: warehouses, isLoading: isWHLoading } = useWarehouseStatic({
        type: "FINISH_GOODS",
        sortBy: "name",
        sortOrder: "asc",
        take: 100,
    });

    const { outlets, isLoading: isOutletLoading } = useOutlets({
        take: 100,
        is_active: "true",
    });

    const form = useForm<RequestStockTransferDTO>({
        resolver: zodResolver(RequestStockTransferSchema),
        defaultValues: {
            barcode: `TRF-${new Date().getTime().toString().slice(-8)}`,
            from_type: "WAREHOUSE",
            to_type: "OUTLET",
            items: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const onSubmit = async (data: RequestStockTransferDTO) => {
        await create.mutateAsync(data);
        router.push("/stock-transfers");
    };

    const fromType = form.watch("from_type");
    const toType = form.watch("to_type");

    // Reset IDs when type changes
    useEffect(() => {
        form.setValue("from_warehouse_id", undefined);
        form.setValue("from_outlet_id", undefined);
    }, [fromType]);

    useEffect(() => {
        form.setValue("to_warehouse_id", undefined);
        form.setValue("to_outlet_id", undefined);
    }, [toType]);

    const addProduct = (product: any) => {
        const exists = fields.find((f) => f.product_id === product.id);
        if (exists) {
            const index = fields.findIndex((f) => f.product_id === product.id);
            const currentQty = form.getValues(`items.${index}.quantity_requested`);
            form.setValue(`items.${index}.quantity_requested`, currentQty + 1);
            return;
        }
        append({
            product_id: product.id,
            quantity_requested: 1,
            notes: "",
            // We'll store product info in a ref or just use it for rendering
            _product: product,
        } as any);
    };

    const fromId =
        fromType === "WAREHOUSE" ? form.watch("from_warehouse_id") : form.watch("from_outlet_id");
    const toId =
        toType === "WAREHOUSE" ? form.watch("to_warehouse_id") : form.watch("to_outlet_id");

    const filteredOutlets = useMemo(() => {
        if (!outlets?.data) return [];
        if (fromType === "WAREHOUSE" && fromId) {
            return outlets.data.filter((o: any) => o.warehouse_id === fromId || o.warehouse?.id === fromId);
        }
        if (toType === "WAREHOUSE" && toId) {
            return outlets.data.filter((o: any) => o.warehouse_id === toId || o.warehouse?.id === toId);
        }
        return outlets.data;
    }, [outlets?.data, fromType, fromId, toType, toId]);

    const filteredWarehouses = useMemo(() => {
        if (!warehouses) return [];
        if (fromType === "OUTLET" && fromId) {
            const selectedOutlet = outlets?.data?.find((o: any) => o.id === fromId);
            const wId = selectedOutlet?.warehouse_id || selectedOutlet?.warehouse?.id;
            if (wId) return warehouses.filter((w: any) => w.id === wId);
        }
        if (toType === "OUTLET" && toId) {
            const selectedOutlet = outlets?.data?.find((o: any) => o.id === toId);
            const wId = selectedOutlet?.warehouse_id || selectedOutlet?.warehouse?.id;
            if (wId) return warehouses.filter((w: any) => w.id === wId);
        }
        return warehouses;
    }, [warehouses, fromType, fromId, toType, toId, outlets?.data]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Source & Destination Selection */}
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                Rute Pengiriman
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-[1fr,40px,1fr] gap-6 items-center">
                                {/* From */}
                                <div className="space-y-4 p-4 rounded-2xl bg-slate-50/30 border border-slate-100/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="size-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Package size={16} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm">
                                            Asal Barang
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <SelectForm
                                            name="from_type"
                                            control={form.control}
                                            label="Tipe Lokasi"
                                            options={[
                                                { value: "WAREHOUSE", label: "Warehouse" },
                                                { value: "OUTLET", label: "Outlet" },
                                            ]}
                                            required
                                        />
                                        {fromType === "WAREHOUSE" ? (
                                            <SelectForm
                                                name="from_warehouse_id"
                                                control={form.control}
                                                label="Pilih Warehouse"
                                                placeholder="-- Pilih Warehouse --"
                                                options={filteredWarehouses?.map((w: any) => ({
                                                    value: w.id,
                                                    label: w.name,
                                                }))}
                                                isLoading={isWHLoading}
                                                canSearching
                                                required
                                            />
                                        ) : (
                                            <SelectForm
                                                name="from_outlet_id"
                                                control={form.control}
                                                label="Pilih Outlet"
                                                placeholder="-- Pilih Outlet --"
                                                options={filteredOutlets?.map((o: any) => ({
                                                    value: o.id,
                                                    label: o.name,
                                                }))}
                                                isLoading={isOutletLoading}
                                                canSearching
                                                required
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center justify-center">
                                    <div className="size-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center text-slate-300">
                                        <MoveDown size={20} className="animate-pulse" />
                                    </div>
                                </div>

                                {/* To */}
                                <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/10 border border-emerald-100/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Store size={16} />
                                        </div>
                                        <span className="font-bold text-slate-700 text-sm">
                                            Tujuan Barang
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                        <SelectForm
                                            name="to_type"
                                            control={form.control}
                                            label="Tipe Lokasi"
                                            options={[
                                                { value: "WAREHOUSE", label: "Warehouse" },
                                                { value: "OUTLET", label: "Outlet" },
                                            ]}
                                            required
                                        />
                                        {toType === "WAREHOUSE" ? (
                                            <SelectForm
                                                name="to_warehouse_id"
                                                control={form.control}
                                                label="Pilih Warehouse"
                                                placeholder="-- Pilih Warehouse --"
                                                options={filteredWarehouses?.map((w: any) => ({
                                                    value: w.id,
                                                    label: w.name,
                                                }))}
                                                isLoading={isWHLoading}
                                                canSearching
                                                required
                                            />
                                        ) : (
                                            <SelectForm
                                                name="to_outlet_id"
                                                control={form.control}
                                                label="Pilih Outlet"
                                                placeholder="-- Pilih Outlet --"
                                                options={filteredOutlets?.map((o: any) => ({
                                                    value: o.id,
                                                    label: o.name,
                                                }))}
                                                isLoading={isOutletLoading}
                                                canSearching
                                                required
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Table */}
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                                <Plus className="h-4 w-4 text-primary" />
                                Daftar Barang Terpilih
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/20">
                                <ProductSelect
                                    onSelect={addProduct}
                                    className="w-full max-w-[600px] h-11"
                                />
                            </div>
                            <Table>
                                <TableHeader className="bg-white">
                                    <TableRow className="border-slate-100 hover:bg-transparent text-[11px] uppercase tracking-wider text-slate-500">
                                        <TableHead className="w-10 text-center">#</TableHead>
                                        <TableHead className="font-bold">Barang</TableHead>
                                        <TableHead className="font-bold text-center w-24">
                                            Stok Asal
                                        </TableHead>
                                        <TableHead className="font-bold text-center w-24">
                                            Stok Tujuan
                                        </TableHead>
                                        <TableHead className="font-bold w-32 text-center">
                                            Qty. Request
                                        </TableHead>
                                        <TableHead className="font-bold">Catatan</TableHead>
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.length > 0 ? (
                                        fields.map((field: any, index) => (
                                            <TableRow key={field.id} className="border-slate-50">
                                                <TableCell className="text-center text-xs text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm leading-tight text-slate-700">
                                                            {field._product?.name}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                {field._product?.code}
                                                            </span>
                                                            {field._product?.product_type && (
                                                                <span className="text-[9px] bg-primary/5 text-primary/70 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                                                                    {
                                                                        field._product?.product_type
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                            {field._product?.size && (
                                                                <span className="text-[9px] text-slate-400 border-l pl-2 border-slate-100">
                                                                    Size:{" "}
                                                                    {field._product?.size.size}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <StockCheckCell
                                                        productId={field.product_id}
                                                        locationType={fromType}
                                                        locationId={fromId}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <StockCheckCell
                                                        productId={field.product_id}
                                                        locationType={toType}
                                                        locationId={toId}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...form.register(
                                                            `items.${index}.quantity_requested`,
                                                            { valueAsNumber: true },
                                                        )}
                                                        className="h-8 text-center rounded-lg border-slate-200"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        {...form.register(`items.${index}.notes`)}
                                                        placeholder="Catatan kecil..."
                                                        className="h-8 rounded-lg border-slate-200 bg-slate-50/50"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-lg"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-32 text-center text-muted-foreground italic text-sm"
                                            >
                                                Belum ada barang yang ditambahkan. <br />
                                                Gunakan tombol "Cari produk" di atas.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Options */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden sticky top-6">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                Informasi Tambahan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 leading-none mb-1">
                                    <Barcode className="size-3.5 text-slate-400" />
                                    Barcode / Ref No.
                                    <span className="text-rose-500">*</span>
                                </label>
                                <Input
                                    {...form.register("barcode")}
                                    readOnly
                                    className="rounded-xl border-slate-200 bg-slate-50/50 font-mono text-xs cursor-not-allowed"
                                    placeholder="Contoh: TRF-2024-001"
                                />
                                {form.formState.errors.barcode && (
                                    <p className="text-[10px] text-rose-500 font-medium">
                                        {form.formState.errors.barcode.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 leading-none mb-1">
                                    Notes / Alasan
                                </label>
                                <Textarea
                                    {...form.register("notes")}
                                    className="rounded-xl border-slate-200 bg-white min-h-[100px] resize-none"
                                    placeholder="Alasan pemindahan barang atau catatan untuk penerima..."
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    disabled={create.isPending || fields.length === 0}
                                    className="w-full rounded-xl shadow-lg shadow-primary/20 h-11"
                                >
                                    {create.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Package className="mr-2 h-4 w-4" />
                                    )}
                                    Buat Transfer Sekarang
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="w-full rounded-xl border-slate-200 shadow-none hover:bg-slate-50"
                                >
                                    Batalkan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
