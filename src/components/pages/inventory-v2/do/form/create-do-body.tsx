"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, Package, Info, Save, XCircle, Loader2 } from "lucide-react";
import {
    RequestDeliveryOrderSchema,
    RequestDeliveryOrderDTO,
    ResponseDeliveryOrderDTO,
} from "@/app/(application)/inventory-v2/do/server/do.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/main";
import { InputForm } from "@/components/ui/form/input";
import { SelectForm } from "@/components/ui/form/select";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useProductsQuery } from "@/app/(application)/products/server/use.products";
import { useOutlets } from "@/app/(application)/outlets/server/use.outlet";
import {
    useFormDeliveryOrder,
    useDOStock,
} from "@/app/(application)/inventory-v2/do/server/use.do";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { SelectFilter } from "@/components/ui/form/select";
import { useState, useEffect } from "react";
import { DatePickerForm } from "@/components/ui/form/date-picker";
import { format } from "date-fns";

interface Props {
    onSuccess: (data: ResponseDeliveryOrderDTO) => void;
    onCancel: () => void;
}

function StockDisplay({
    warehouseId,
    outletId,
    productId,
}: {
    warehouseId?: number;
    outletId?: number;
    productId?: number;
}) {
    const { data: whStock, isLoading: whLoading } = useDOStock(warehouseId, productId);
    const { data: outStock, isLoading: outLoading } = useDOStock(undefined, productId, outletId);

    if (!productId) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mt-1">
            {warehouseId && (
                <div className="flex items-center gap-1">
                    {whLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : (
                        <span
                            className={`text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded-sm ${(whStock || 0) <= 0 ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}
                        >
                            Gudang: {whStock || 0}
                        </span>
                    )}
                </div>
            )}

            {outletId && (
                <div className="flex items-center gap-1">
                    {outLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : (
                        <span className="text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-600 border border-blue-100">
                            Outlet: {outStock || 0}
                        </span>
                    )}
                </div>
            )}

            {warehouseId && (whStock || 0) <= 0 && (
                <span className="text-[9px] text-rose-600 font-bold animate-pulse italic">
                    ⚠️ Stok Kosong
                </span>
            )}
        </div>
    );
}

export function CreateDOBody({ onSuccess, onCancel }: Props) {
    const { data: warehouses, isLoading: whLoading } = useWarehouses();
    const [targetType, setTargetType] = useState<"RETAIL" | "MARKETPLACE">("RETAIL");

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

    // Fetch outlets based on Target Type.
    const { outlets, isLoading: outLoading } = useOutlets({
        take: 100,
        status: "active",
        type: targetType,
    } as any);

    const { data: products, isLoading: productsLoading } = useProductsQuery({
        take: 5000,
        status: "ACTIVE",
        sortBy: "name",
        sortOrder: "asc",
    } as any);

    const { create } = useFormDeliveryOrder();

    const form = useForm<RequestDeliveryOrderDTO>({
        resolver: zodResolver(RequestDeliveryOrderSchema) as any,
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            from_warehouse_id: undefined,
            to_outlet_id: undefined,
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

    const onSubmit = (data: RequestDeliveryOrderDTO) => {
        create.mutate(data, {
            onSuccess: (res) => onSuccess(res as ResponseDeliveryOrderDTO),
        });
    };

    return (
        <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
                <Alert className="">
                    <Info className="h-4 w-4" />
                    <AlertTitle className="text-xs font-bold uppercase tracking-wider">
                        DO Flow
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                        Tentukan barang dari gudang tujuan outlet. Status awal dokumen masuk sebagai
                        Packing List / DRAFT.
                    </AlertDescription>
                </Alert>

                {/* Main Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <SelectForm
                        name="from_warehouse_id"
                        control={form.control}
                        label="Gudang Asal"
                        placeholder="Pilih Gudang..."
                        options={
                            warehouses
                                ?.filter((w: any) => w.type === "FINISH_GOODS")
                                .map((w: any) => ({
                                    value: w.id,
                                    label: w.name,
                                })) ?? []
                        }
                        isLoading={whLoading}
                        error={form.formState.errors.from_warehouse_id}
                        canSearching
                    />

                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-zinc-600 block">
                                Tipe Tujuan
                            </label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded border border-gray-500 bg-background px-3 py-2 text-sm"
                                value={targetType}
                                onChange={(e) => setTargetType(e.target.value as any)}
                            >
                                <option value="RETAIL">Toko (Retail)</option>
                                <option value="MARKETPLACE">Reseller / Marketplace</option>
                            </select>
                        </div>
                        <div className="flex-2">
                            <SelectFilter
                                size="default"
                                placeholder="Pilih Tujuan..."
                                value={form.watch("to_outlet_id") ?? null}
                                options={
                                    outlets?.data?.map((o: any) => ({
                                        value: o.id,
                                        label: o.name,
                                    })) ?? []
                                }
                                onChange={(val) => form.setValue("to_outlet_id", Number(val))}
                                onReset={() => form.setValue("to_outlet_id", undefined as any)}
                                isLoading={outLoading}
                                canSearching={true}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <DatePickerForm
                        name="date"
                        control={form.control}
                        label="Tanggal DO"
                        required
                        error={form.formState.errors.date}
                    />

                    <InputForm
                        name="notes"
                        control={form.control}
                        label="Catatan Pengiriman"
                        placeholder="Misal: Urgent..."
                        error={form.formState.errors.notes}
                    />
                </div>

                {/* Items Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />
                            Daftar Barang Kirim
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
                                                        label: `[${p.code}] ${p.name} ${p.product_type?.name?.toUpperCase()} ${p.size?.size}ML`,
                                                    })) ?? []
                                                }
                                                canSearching
                                                isLoading={productsLoading}
                                                error={
                                                    form.formState.errors.items?.[index]?.product_id
                                                }
                                            />
                                            <StockDisplay
                                                warehouseId={form.watch("from_warehouse_id")}
                                                outletId={form.watch("to_outlet_id")}
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
                                    <div className="col-span-10 md:col-span-4">
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
                    <Button type="submit" disabled={create.isPending}>
                        {create.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Buat Packing List DO
                    </Button>
                </div>
            </div>
        </Form>
    );
}
