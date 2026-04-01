"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, Package, Info, Save, XCircle, Loader2 } from "lucide-react";
import {
    RequestTransferGudangSchema,
    RequestTransferGudangDTO,
    ResponseTransferGudangDTO,
} from "@/app/(application)/inventory-v2/tg/server/tg.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/main";
import { InputForm } from "@/components/ui/form/input";
import { SelectForm } from "@/components/ui/form/select";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useProductsQuery } from "@/app/(application)/products/server/use.products";
import {
    useFormTransferGudang,
    useTGStock,
} from "@/app/(application)/inventory-v2/tg/server/use.tg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { DatePickerForm } from "@/components/ui/form/date-picker";
import { format } from "date-fns";

interface Props {
    onSuccess: (data: ResponseTransferGudangDTO) => void;
    onCancel: () => void;
}

function StockDisplay({
    sourceWarehouseId,
    targetWarehouseId,
    productId,
}: {
    sourceWarehouseId?: number;
    targetWarehouseId?: number;
    productId?: number;
}) {
    const { data: sourceStock, isLoading: sourceLoading } = useTGStock(sourceWarehouseId, productId);
    const { data: targetStock, isLoading: targetLoading } = useTGStock(targetWarehouseId, productId);

    if (!productId) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mt-1">
            {sourceWarehouseId && (
                <div className="flex items-center gap-1">
                    {sourceLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : (
                        <span
                            className={`text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded-sm ${(sourceStock || 0) <= 0 ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}
                        >
                            Asal: {sourceStock || 0}
                        </span>
                    )}
                </div>
            )}

            {targetWarehouseId && (
                <div className="flex items-center gap-1">
                    {targetLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : (
                        <span className="text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-600 border border-blue-100">
                            Tujuan: {targetStock || 0}
                        </span>
                    )}
                </div>
            )}

            {sourceWarehouseId && (sourceStock || 0) <= 0 && (
                <span className="text-[9px] text-rose-600 font-bold animate-pulse italic">
                    ⚠️ Stok Kosong d Asal
                </span>
            )}
        </div>
    );
}

export function CreateTGBody({ onSuccess, onCancel }: Props) {
    const { data: warehouses, isLoading: whLoading } = useWarehouses();

    // Fetch products
    const { data: products, isLoading: productsLoading } = useProductsQuery({
        take: 5000,
        status: "ACTIVE",
        sortBy: "name",
        sortOrder: "asc",
    } as any);

    const { create } = useFormTransferGudang();
    
    // Set default Warehouse SBY
    useEffect(() => {
        if (warehouses && warehouses.length > 0) {
            const defaultWH = warehouses.find(
                (w: any) => w.code === "GFG-SBY" || w.name?.includes("Pusat SBY"),
            );
            if (defaultWH && !form.getValues("from_warehouse_id")) {
                form.setValue("from_warehouse_id", defaultWH.id);
            }
        }
    }, [warehouses]);

    const form = useForm<RequestTransferGudangDTO>({
        resolver: zodResolver(RequestTransferGudangSchema) as any,
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            from_warehouse_id: undefined,
            to_warehouse_id: undefined,
            notes: "",
            items: [
                {
                    product_id: undefined as any,
                    quantity_requested: 1,
                    notes: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items" as const,
    });

    const onSubmit = (data: RequestTransferGudangDTO) => {
        create.mutate(data, {
            onSuccess: (res) => onSuccess(res as ResponseTransferGudangDTO),
        });
    };

    const warehouseOptions = warehouses
        ?.filter((w: any) => w.type === "FINISH_GOODS")
        .map((w: any) => ({
            value: w.id,
            label: w.name,
        })) ?? [];

    return (
        <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
                <Alert className="border-amber-200 bg-amber-50">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        Transfer Gudang Flow
                    </AlertTitle>
                    <AlertDescription className="text-xs text-amber-700">
                        Pindahkan stok antar Gudang Finish Goods. Pastikan stok d gudang asal mencukupi.
                        Status awal dokumen masuk sebagai Packing List.
                    </AlertDescription>
                </Alert>

                {/* Main Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <SelectForm
                        name="from_warehouse_id"
                        control={form.control}
                        label="Gudang Asal"
                        placeholder="Pilih Gudang Asal..."
                        options={warehouseOptions}
                        isLoading={whLoading}
                        error={form.formState.errors.from_warehouse_id}
                        canSearching
                    />

                    <SelectForm
                        name="to_warehouse_id"
                        control={form.control}
                        label="Gudang Tujuan"
                        placeholder="Pilih Gudang Tujuan..."
                        options={warehouseOptions}
                        isLoading={whLoading}
                        error={form.formState.errors.to_warehouse_id}
                        canSearching
                    />

                    <DatePickerForm
                        name="date"
                        control={form.control}
                        label="Tanggal Transfer"
                        required
                        error={form.formState.errors.date}
                    />

                    <InputForm
                        name="notes"
                        control={form.control}
                        label="Catatan Transfer"
                        placeholder="Misal: Stok menipis d cabang..."
                        error={form.formState.errors.notes}
                    />
                </div>

                {/* Items Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />
                            Daftar Barang Transfer
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 border-dashed font-bold"
                            onClick={() =>
                                append({
                                    product_id: undefined as any,
                                    quantity_requested: 1,
                                    notes: "",
                                })
                            }
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Tambah Baris
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {fields.map((fieldItem, index) => (
                            <Card
                                key={fieldItem.id}
                                className="border-slate-100/80 shadow-none bg-slate-50/20"
                            >
                                <CardContent className="p-3 space-y-1">
                                    <div className="grid grid-cols-12 gap-3 items-start">
                                        <div className="col-span-12 md:col-span-8">
                                            <SelectForm
                                                name={`items.${index}.product_id`}
                                                control={form.control}
                                                label="Produk (SKU)"
                                                placeholder="Pilih Produk..."
                                                className="space-y-1"
                                                options={
                                                    products?.map((p: any) => ({
                                                        value: p.id,
                                                        label: `[${p.code}] ${p.name} - ${p.product_type?.name || ""} • ${p.size?.size || ""} ${p.unit?.name || ""} • ${p.gender || ""}`.toUpperCase(),
                                                    })) ?? []
                                                }
                                                canSearching
                                                isLoading={productsLoading}
                                                error={
                                                    form.formState.errors.items?.[index]?.product_id
                                                }
                                            />
                                            <StockDisplay
                                                sourceWarehouseId={form.watch("from_warehouse_id")}
                                                targetWarehouseId={form.watch("to_warehouse_id")}
                                                productId={form.watch(`items.${index}.product_id`)}
                                            />
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <InputForm
                                                label="Kuantitas (Qty)"
                                                name={`items.${index}.quantity_requested`}
                                                control={form.control}
                                                type="number"
                                                error={
                                                    form.formState.errors.items?.[index]
                                                        ?.quantity_requested as any
                                                }
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-2 text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-300 hover:text-rose-500 transition-colors"
                                                disabled={fields.length === 1}
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="col-span-10 md:col-span-4 mt-2">
                                        <InputForm
                                            label="Catatan Item"
                                            name={`items.${index}.notes`}
                                            control={form.control}
                                            placeholder="Opsional.."
                                            error={form.formState.errors.items?.[index]?.notes}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="border border-slate-100 hover:bg-slate-50 font-semibold"
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Batal
                    </Button>
                    <Button type="submit" disabled={create.isPending} className="bg-amber-600 hover:bg-amber-700">
                        {create.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Buat Packing List TG
                    </Button>
                </div>
            </div>
        </Form>
    );
}
