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

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Plus, Save, Trash } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function FormRecipe() {
    const { id } = useParams<{ id: string }>();

    const { product, rawmat } = useRecipeUtilsOption();
    const { detail, isLoading: isDetailLoading } = useRecipe(undefined, Number(id));

    const form = useForm<RequestRecipeDTO>({
        resolver: zodResolver(RequestRecipeSchema),
        defaultValues: {
            product_id: undefined,
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
            description: detail.data.description || "",
            raw_material: detail.data.items.map((r) => ({
                raw_material_id: r.raw_mat_id,
                quantity: r.quantity,
            })),
        });

        isHydratedRef.current = true;
    }, [detail, form]);

    const onSubmit = form.handleSubmit(async (body) => {
        await recipe.mutateAsync(body);
    });

    const selectedRawMaterialIds = form.watch("raw_material")?.map((r) => r.raw_material_id) ?? [];

    const isDisabled = recipe.isPending || isDetailLoading || product.isLoading || rawmat.isLoading;

    /**
     * 🟡 Global Loading Skeleton
     */
    if (isDetailLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <section>
            <Form methods={form} onSubmit={onSubmit}>
                <Card className="w-full">
                    <CardHeader className="space-y-3">
                        <Button
                            onClick={() => window.history.back()}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit"
                            disabled={isDisabled}
                        >
                            <ArrowLeft />
                            Kembali
                        </Button>

                        <CardTitle>Pembuatan Resep Produk</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <SelectForm
                            name="product_id"
                            control={form.control}
                            // CONTOH CUSTOM LABEL: Menggunakan Icon + Teks
                            label={"Pilihan Produk"}
                            required
                            canSearching
                            isLoading={isDisabled}
                            error={form.formState.errors.product_id}
                            options={product.data?.map((p) => ({
                                value: p.id,
                                // Label utama lebih bersih
                                label: `${p.name}`,
                                // Info detail ditaruh di bawah label (description)
                                description: `Kode: ${p.code} | Tipe: ${p.type?.toUpperCase()} | Size: ${p.size?.toUpperCase()}`,
                            }))}
                            placeholder="Pilih produk..."
                        />

                        <InputForm
                            name="description"
                            control={form.control}
                            label="Keterangan / Versi Info"
                            placeholder="Contoh: Penyesuaian aroma vanila v2"
                            disabled={isDisabled}
                            error={form.formState.errors.description}
                        />

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-4 gap-3 items-end">
                                    <SelectForm
                                        name={`raw_material.${index}.raw_material_id`}
                                        control={form.control}
                                        label="Raw Material"
                                        isLoading={isDisabled}
                                        required
                                        canSearching
                                        error={
                                            form.formState.errors.raw_material?.[index]
                                                ?.raw_material_id
                                        }
                                        options={rawmat.data
                                            ?.filter((r) => {
                                                const usedIds = selectedRawMaterialIds.filter(
                                                    (_, i) => i !== index,
                                                );
                                                return !usedIds.includes(r.id);
                                            })
                                            .map((r) => ({
                                                value: r.id,
                                                label: r.name,
                                            }))}
                                    />

                                    <InputForm
                                        name={`raw_material.${index}.quantity`}
                                        type="number"
                                        control={form.control}
                                        label="Qty"
                                        required
                                        disabled={isDisabled}
                                        error={
                                            form.formState.errors.raw_material?.[index]?.quantity
                                        }
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        disabled={isDisabled}
                                        onClick={() => remove(index)}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={isDisabled}
                            onClick={() =>
                                append({
                                    raw_material_id: undefined as any,
                                    quantity: 0,
                                })
                            }
                        >
                            <Plus />
                            Tambah Raw Material
                        </Button>
                    </CardContent>

                    <CardFooter>
                        <Button className="ms-auto" type="submit" disabled={isDisabled}>
                            {recipe.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                            Simpan
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </section>
    );
}
