"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, Package, Save, XCircle, Loader2, Undo2 } from "lucide-react";
import {
    RequestReturnSchema,
    RequestReturnDTO,
    ResponseReturnDTO,
} from "@/app/(application)/inventory-v2/return/server/return.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/main";
import { InputForm } from "@/components/ui/form/input";
import { SelectForm } from "@/components/ui/form/select";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useProductsQuery } from "@/app/(application)/products/server/use.products";
import { useOutlets } from "@/app/(application)/outlets/server/use.outlet";
import { useFormReturn } from "@/app/(application)/inventory-v2/return/server/use.return";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { SelectFilter } from "@/components/ui/form/select";
import { useState, useEffect } from "react";

interface Props {
    onSuccess: (data: ResponseReturnDTO) => void;
    onCancel: () => void;
}

export function CreateReturnBody({ onSuccess, onCancel }: Props) {
    const { data: warehouses, isLoading: whLoading } = useWarehouses();
    const [fromType, setFromType] = useState<"WAREHOUSE" | "OUTLET">("OUTLET");
    const [outletType, setOutletType] = useState<"RETAIL" | "MARKETPLACE">("RETAIL");

    const { outlets, isLoading: outLoading } = useOutlets({
        take: 100,
        status: "active",
        type: outletType,
    } as any);

    const { data: products, isLoading: productsLoading } = useProductsQuery({
        take: 5000,
        status: "ACTIVE",
        sortBy: "name",
        sortOrder: "asc",
    } as any);

    const { create } = useFormReturn();

    const form = useForm<RequestReturnDTO>({
        resolver: zodResolver(RequestReturnSchema) as any,
        defaultValues: {
            from_type: "OUTLET",
            from_warehouse_id: undefined,
            from_outlet_id: undefined,
            to_type: "WAREHOUSE",
            to_warehouse_id: undefined,
            notes: "",
            items: [
                {
                    product_id: undefined as any,
                    quantity: 1,
                    notes: "",
                },
            ],
        },
    });

    // Default To Warehouse SBY
    useEffect(() => {
        if (warehouses && warehouses.length > 0) {
            const defaultWH = warehouses.find(
                (w: any) => w.code === "GFG-SBY" || w.name?.includes("Pusat SBY")
            );
            if (defaultWH && !form.getValues("to_warehouse_id")) {
                form.setValue("to_warehouse_id", defaultWH.id);
            }
        }
    }, [warehouses]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items" as const,
    });

    const onSubmit = (data: RequestReturnDTO) => {
        create.mutate(data, {
            onSuccess: (res) => onSuccess(res as ResponseReturnDTO),
        });
    };

    return (
        <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6 text-left">
                <Alert className="bg-amber-50 border-amber-200">
                    <Undo2 className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        Manual Return
                    </AlertTitle>
                    <AlertDescription className="text-xs text-amber-700">
                        Gunakan fitur ini untuk membuat dokumen pengembalian barang secara manual dari Outlet atau Gudang Cabang ke Pusat.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-600">Asal Barang (From)</label>
                            <div className="flex gap-2">
                                <Button 
                                    type="button"
                                    variant={fromType === "OUTLET" ? "default" : "outline"}
                                    size="sm"
                                    className="flex-1 font-bold text-xs"
                                    onClick={() => {
                                        setFromType("OUTLET");
                                        form.setValue("from_type", "OUTLET");
                                        form.setValue("from_warehouse_id", null);
                                    }}
                                >
                                    Outlet / Store
                                </Button>
                                <Button 
                                    type="button"
                                    variant={fromType === "WAREHOUSE" ? "default" : "outline"}
                                    size="sm"
                                    className="flex-1 font-bold text-xs"
                                    onClick={() => {
                                        setFromType("WAREHOUSE");
                                        form.setValue("from_type", "WAREHOUSE");
                                        form.setValue("from_outlet_id", null);
                                    }}
                                >
                                    Warehouse
                                </Button>
                            </div>
                        </div>

                        {fromType === "OUTLET" ? (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase text-zinc-400">Tipe Outlet</label>
                                    <select
                                        className="flex h-9 w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium"
                                        value={outletType}
                                        onChange={(e) => setOutletType(e.target.value as any)}
                                    >
                                        <option value="RETAIL">Toko (Retail)</option>
                                        <option value="MARKETPLACE">Reseller / Marketplace</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase text-zinc-400">Pilih Outlet</label>
                                    <SelectFilter
                                        size="default"
                                        placeholder="Cari Outlet..."
                                        value={form.watch("from_outlet_id") ?? null}
                                        options={
                                            outlets?.data?.map((o: any) => ({
                                                value: o.id,
                                                label: o.name,
                                            })) ?? []
                                        }
                                        onChange={(val) => form.setValue("from_outlet_id", Number(val))}
                                        onReset={() => form.setValue("from_outlet_id", undefined as any)}
                                        isLoading={outLoading}
                                        canSearching={true}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ) : (
                            <SelectForm
                                name="from_warehouse_id"
                                control={form.control}
                                label="Pilih Gudang Asal"
                                placeholder="Gudang pengirim..."
                                options={
                                    warehouses?.map((w: any) => ({
                                        value: w.id,
                                        label: w.name,
                                    })) ?? []
                                }
                                isLoading={whLoading}
                                canSearching
                            />
                        )}
                    </div>

                    <div className="space-y-4">
                        <SelectForm
                            name="to_warehouse_id"
                            control={form.control}
                            label="Tujuan (Destination)"
                            placeholder="Kembali ke Gudang..."
                            options={
                                warehouses
                                    ?.filter((w: any) => w.type === "FINISH_GOODS")
                                    .map((w: any) => ({
                                        value: w.id,
                                        label: w.name,
                                    })) ?? []
                            }
                            isLoading={whLoading}
                            error={form.formState.errors.to_warehouse_id}
                            canSearching
                        />

                        <InputForm
                            name="notes"
                            control={form.control}
                            label="Catatan Retur"
                            placeholder="Alasan pengembalian..."
                            error={form.formState.errors.notes}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-zinc-700 flex items-center gap-2 text-sm uppercase tracking-tight">
                            <Package className="h-4 w-4 text-zinc-400" />
                            Daftar Barang Retur
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-7 border-dashed font-bold uppercase tracking-wider"
                            onClick={() =>
                                append({
                                    product_id: undefined as any,
                                    quantity: 1,
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
                                className="border-slate-100 shadow-none bg-zinc-50/50"
                            >
                                <CardContent className="p-3 space-y-2">
                                    <div className="grid grid-cols-12 gap-3 items-start">
                                        <div className="col-span-12 md:col-span-8 text-left">
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
                                                error={form.formState.errors.items?.[index]?.product_id}
                                            />
                                        </div>
                                        <div className="col-span-8 md:col-span-3 text-left">
                                            <InputForm
                                                label="Kuantitas"
                                                name={`items.${index}.quantity`}
                                                control={form.control}
                                                type="number"
                                                error={form.formState.errors.items?.[index]?.quantity as any}
                                            />
                                        </div>
                                        <div className="col-span-4 md:col-span-1 pt-6 text-right flex justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-300 hover:text-rose-500 transition-colors"
                                                disabled={fields.length === 1}
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <InputForm
                                            label="Alasan Item"
                                            name={`items.${index}.notes`}
                                            control={form.control}
                                            placeholder="Opsional (misal: cacat produksi)"
                                            error={form.formState.errors.items?.[index]?.notes}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        className="border border-zinc-200 hover:bg-zinc-50 font-bold text-xs"
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Batal
                    </Button>
                    <Button type="submit" disabled={create.isPending} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wide px-6">
                        {create.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Simpan Draft Retur
                    </Button>
                </div>
            </div>
        </Form>
    );
}
