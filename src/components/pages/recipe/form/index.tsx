"use client";

import {
    RequestRecipeDTO,
    RequestRecipeSchema,
} from "@/app/(application)/recipes/server/recipe.schema";
import {
    useFormRecipe,
    useRecipe,
    useRecipeUtilsOption,
} from "@/app/(application)/recipes/server/use.recipe";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { SelectForm } from "@/components/ui/form/select";
import { Form } from "@/components/ui/form/main";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckboxForm } from "@/components/ui/form/checkbox";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Plus, Save, Trash } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { formatCurrency } from "@/lib/utils";

export function FormRecipe() {
    const { id } = useParams<{ id: string }>();

    const { product, rawmat } = useRecipeUtilsOption();
    const { detail, isLoading: isDetailLoading } = useRecipe(undefined, Number(id));

    const form = useForm<RequestRecipeDTO>({
        resolver: zodResolver(RequestRecipeSchema),
        defaultValues: {
            product_id: undefined,
            version: 1,
            is_active: true,
            description: "",
            raw_material: [
                {
                    raw_material_id: undefined as any,
                    quantity: 0,
                },
            ],
        },
    });

    const recipe = useFormRecipe();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "raw_material",
    });

    /**
     * 🛑 Guard agar reset hanya sekali
     */
    const isHydratedRef = useRef(false);

    useEffect(() => {
        if (!detail?.data || isHydratedRef.current) return;

        form.reset({
            product_id: detail.data.product_id,
            version: detail.data.version,
            is_active: detail.data.is_active,
            description: detail.data.description || "",
            raw_material: detail.data.recipes.map((r) => ({
                raw_material_id: r.raw_mat_id,
                quantity: r.quantity,
            })),
        });

        isHydratedRef.current = true;
    }, [detail, form]);

    const onSubmit = form.handleSubmit(async (body: RequestRecipeDTO) => {
        await recipe.mutateAsync(body);
    });

    /**
     * 💰 Real-time Cost Calculation
     */
    const watchedMaterials = form.watch("raw_material") || [];

    const materialCosts = useMemo(() => {
        return watchedMaterials.map((m) => {
            const mat = rawmat.data?.find((r) => r.id === m.raw_material_id);
            const price = mat?.price || 0;
            const qty = Number(m.quantity) || 0;
            return {
                price,
                total: price * qty,
            };
        });
    }, [watchedMaterials, rawmat.data]);

    const totalBOMCost = useMemo(() => {
        return materialCosts.reduce((acc, curr) => acc + curr.total, 0);
    }, [materialCosts]);

    const selectedRawMaterialIds = watchedMaterials.map((r) => r.raw_material_id);

    const isDisabled = recipe.isPending || isDetailLoading || product.isLoading || rawmat.isLoading;

    /**
     * 🟡 Global Loading Skeleton
     */
    if (isDetailLoading) {
        return (
            <Card className="w-full border-slate-200 rounded-[18px] shadow-[0_10px_20px_rgba(15,23,42,0.06)] overflow-hidden">
                <CardHeader className="bg-slate-50/50">
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4 p-6 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-50" />
                    <p className="text-sm text-slate-400 font-medium">Memuat data resep...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
            <Form methods={form} onSubmit={onSubmit}>
                <Card className="w-full border-slate-200 rounded-[18px] shadow-[0_10px_20px_rgba(15,23,42,0.06)] overflow-hidden bg-white">
                    <CardHeader className="space-y-4 p-6 border-b border-slate-100 bg-slate-50/30">
                        <Button
                            onClick={() => window.history.back()}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit h-8 text-[11px] font-bold bg-white hover:bg-slate-50 border-slate-200 shadow-sm"
                            disabled={isDisabled}
                        >
                            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                            Kembali
                        </Button>

                        <div className="space-y-1">
                            <CardTitle className="text-xl font-extrabold tracking-tight text-slate-950">
                                {id ? "Perbarui Resep Produk" : "Pembuatan Resep Produk"}
                            </CardTitle>
                            <p className="text-[13px] text-slate-500 font-medium">
                                Masukkan rincian kebutuhan material untuk formula produk Anda.
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 p-6 lg:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-4 border-b border-slate-100">
                            <div className="lg:col-span-4 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-5 w-1 bg-primary rounded-full" />
                                    <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800">
                                        Informasi Utama
                                    </h3>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                    Tentukan produk target, versi resep, dan status aktifitas formula ini.
                                </p>
                            </div>

                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <SelectForm
                                        name="product_id"
                                        control={form.control}
                                        label={"Pilihan Produk"}
                                        required
                                        canSearching
                                        isLoading={isDisabled}
                                        error={form.formState.errors.product_id}
                                        options={product.data?.map((p) => ({
                                            value: p.id,
                                            label: `${p.name}`,
                                            description: `Kode: ${p.code} | Tipe: ${p.product_type?.name?.toUpperCase()} | Size: ${p.size?.size}`,
                                        }))}
                                        placeholder="Pilih produk..."
                                    />
                                </div>

                                <InputForm
                                    name="version"
                                    type="number"
                                    control={form.control}
                                    label="Versi Resep"
                                    required
                                    disabled={isDisabled}
                                    error={form.formState.errors.version}
                                />

                                <div className="flex items-center h-full pt-6">
                                    <CheckboxForm
                                        name="is_active"
                                        control={form.control}
                                        label="Tetapkan sebagai Resep Aktif"
                                        disabled={isDisabled}
                                        className="font-bold text-slate-700"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <InputForm
                                        name="description"
                                        control={form.control}
                                        label="Keterangan / Catatan Versi"
                                        placeholder="Contoh: Penyesuaian aroma vanila v2"
                                        disabled={isDisabled}
                                        error={form.formState.errors.description}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Materials */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-1 bg-primary rounded-full" />
                                        <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800">
                                            Komposisi Material
                                        </h3>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        Tambahkan raw material dan tentukan jumlah yang diperlukan.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-4 text-[11px] font-bold text-primary border-primary/20 hover:bg-primary/5 hover:border-primary shadow-sm transition-all"
                                    disabled={isDisabled}
                                    onClick={() =>
                                        append({
                                            raw_material_id: undefined as any,
                                            quantity: 0,
                                        })
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Material
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="group relative flex flex-col xl:flex-row gap-4 items-start xl:items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm"
                                    >
                                        <div className="flex-1 w-full min-w-[300px]">
                                            <SelectForm
                                                name={`raw_material.${index}.raw_material_id`}
                                                control={form.control}
                                                label="Raw Material"
                                                isLoading={isDisabled}
                                                required
                                                canSearching
                                                error={form.formState.errors.raw_material?.[index]?.raw_material_id}
                                                options={rawmat.data
                                                    ?.filter((r: any) => {
                                                        const usedIds = selectedRawMaterialIds.filter((_, i) => i !== index);
                                                        return !usedIds.includes(r.id);
                                                    })
                                                    .map((r: any) => ({
                                                        value: r.id,
                                                        label: r.name,
                                                        description: `Stock: ${r.current_stock} ${r.unit_raw_material?.name} | Harga: ${formatCurrency(r.price)}`,
                                                    }))}
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                                            <div className="w-24 shrink-0">
                                                <InputForm
                                                    name={`raw_material.${index}.quantity`}
                                                    type="number"
                                                    control={form.control}
                                                    label="Qty"
                                                    required
                                                    disabled={isDisabled}
                                                    error={form.formState.errors.raw_material?.[index]?.quantity}
                                                />
                                            </div>

                                            <div className="w-32 shrink-0">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Harga Unit</label>
                                                <div className="h-9 flex items-center px-3 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 tabular-nums">
                                                    {formatCurrency(materialCosts[index]?.price)}
                                                </div>
                                            </div>

                                            <div className="w-36 shrink-0">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-primary/70 mb-1 block">Subtotal</label>
                                                <div className="h-9 flex items-center px-3 bg-primary/5 border border-primary/20 rounded-lg text-[11px] font-black text-primary tabular-nums">
                                                    {formatCurrency(materialCosts[index]?.total)}
                                                </div>
                                            </div>

                                            <div className="pt-4 xl:pt-5">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-9 w-9 shrink-0 rounded-lg shadow-sm hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    disabled={isDisabled || fields.length === 1}
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Section: Formula Summary */}
                            <div className="mt-8 p-4 md:p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden relative group transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                                            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">Cost Calculation</h4>
                                        </div>
                                        <p className="text-[16px] font-bold text-white tracking-tight">Total Estimasi Modal BOM</p>
                                    </div>
                                    
                                    <div className="bg-white/5 backdrop-blur-sm border border-white/5 px-6 py-3 rounded-lg flex items-baseline gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total</span>
                                        <span className="text-2xl font-black text-white tabular-nums">
                                            {formatCurrency(totalBOMCost)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Save className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[12px] font-black uppercase tracking-widest text-slate-700">
                                    Finalisasi Formula
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium italic">
                                    Pastikan seluruh komposisi material sudah akurat.
                                </p>
                            </div>
                        </div>

                        <Button
                            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-black px-10 py-6 h-auto text-[14px] uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 rounded-xl"
                            type="submit"
                            disabled={isDisabled}
                        >
                            {recipe.isPending ? (
                                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                            ) : (
                                <Save className="h-5 w-5 mr-3" />
                            )}
                            Simpan Formula Resep
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </section>
    );
}
