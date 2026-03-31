"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Plus, Package, Info, Save, XCircle, Loader2 } from "lucide-react";
import {
    CreateGoodsReceiptSchema,
    CreateGoodsReceiptDTO,
    GoodsReceiptDTO,
} from "@/app/(application)/inventory-v2/gr/server/gr.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form/main";
import { InputForm } from "@/components/ui/form/input";
import { SelectForm } from "@/components/ui/form/select";
import { DatePickerForm } from "@/components/ui/form/date-picker";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useProductsQuery } from "@/app/(application)/products/server/use.products";
import { useFormGoodsReceipt } from "@/app/(application)/inventory-v2/gr/server/use.gr";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface Props {
    onSuccess: (data: GoodsReceiptDTO) => void;
    onCancel: () => void;
}

export function CreateGRBody({ onSuccess, onCancel }: Props) {
    const { data: warehouses, isLoading: whLoading } = useWarehouses();
    const { data: products, isLoading: productsLoading } = useProductsQuery({
        take: 5000,
        status: "ACTIVE",
        sortBy: "name",
        sortOrder: "asc",
    } as any);
    const { create } = useFormGoodsReceipt();

    const form = useForm<CreateGoodsReceiptDTO>({
        resolver: zodResolver(CreateGoodsReceiptSchema) as any,
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            type: "MANUAL",
            warehouse_id: undefined,
            notes: "",
            items: [
                {
                    product_id: undefined as any,
                    quantity_planned: 0,
                    quantity_actual: 0,
                    notes: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items" as const,
    });

    const onSubmit = (data: CreateGoodsReceiptDTO) => {
        // Sync quantity_planned and quantity_actual for each item if they differ in the UI context
        // and ensure we are using the value intended by the user.
        const submittedData = {
            ...data,
            items: data.items.map((item) => ({
                ...item,
                // In case the UI only allowed editing one, we ensure both are updated
                quantity_planned: Number(item.quantity_actual),
                quantity_actual: Number(item.quantity_actual),
            })),
        };
        create.mutate(submittedData, {
            onSuccess: (res) => onSuccess(res as GoodsReceiptDTO),
        });
    };

    return (
        <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
                <Alert className="bg-indigo-50 border-indigo-100 text-indigo-700">
                    <Info className="h-4 w-4 text-indigo-500" />
                    <AlertTitle className="text-xs font-bold uppercase tracking-wider">
                        Penting
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                        Pastikan gudang tujuan dan kuantitas sesuai sebelum menyimpan. Data ini akan
                        menjadi dasar mutasi stok setelah diposting.
                    </AlertDescription>
                </Alert>

                {/* Main Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectForm
                        name="warehouse_id"
                        control={form.control}
                        label="Gudang Tujuan"
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
                        error={form.formState.errors.warehouse_id}
                    />

                    <DatePickerForm
                        name="date"
                        control={form.control}
                        label="Tanggal Terima"
                        required
                        error={form.formState.errors.date}
                    />

                    <SelectForm
                        name="type"
                        control={form.control}
                        label="Tipe GR"
                        placeholder="Pilih Tipe..."
                        options={[
                            { value: "MANUAL", label: "MANUAL" },
                            { value: "QC_FG", label: "QC PRODUCTION" },
                        ]}
                        error={form.formState.errors.type}
                    />

                    <InputForm
                        name="notes"
                        control={form.control}
                        label="Catatan (Internal)"
                        placeholder="..."
                        error={form.formState.errors.notes}
                    />
                </div>

                {/* Items Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />
                            Daftar Item / SKU
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 border-dashed border-indigo-200 bg-indigo-50/30 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-bold"
                            onClick={() =>
                                append({
                                    product_id: undefined as any,
                                    quantity_planned: 0,
                                    quantity_actual: 0,
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
                                className="border-slate-100/80 shadow-none bg-slate-50/20 hover:bg-indigo-50/10 transition-all duration-200"
                            >
                                <CardContent className="p-3 space-y-1">
                                    <div className="grid grid-cols-12 gap-3 items-end">
                                        <div className="col-span-12 md:col-span-8">
                                            <SelectForm
                                                name={`items.${index}.product_id`}
                                                control={form.control}
                                                label="Produk (SKU)"
                                                placeholder="Pilih Produk..."
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
                                        </div>
                                        <div className="col-span-6 md:col-span-2">
                                            <InputForm
                                                label="Kuantitas"
                                                name={`items.${index}.quantity_actual`}
                                                control={form.control}
                                                type="number"
                                                className="border-indigo-200 bg-indigo-50/40"
                                                error={
                                                    form.formState.errors.items?.[index]
                                                        ?.quantity_actual as any
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
                                            placeholder="rusak, dsb.."
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
                    <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100"
                        disabled={create.isPending}
                    >
                        {create.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Simpan Draft GR
                    </Button>
                </div>
            </div>
        </Form>
    );
}
