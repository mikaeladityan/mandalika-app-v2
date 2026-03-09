"use client";

import {
    RequestRawMaterialDTO,
    RequestRawMaterialSchema,
} from "@/app/(application)/rawmat/server/rawmat.schema";
import { useFormRawMat, useRawMaterialUtils } from "@/app/(application)/rawmat/server/use.rawmat";
import { LogData } from "@/components/log";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCreatableCombobox } from "@/components/ui/form/createable.combobox";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { SelectForm } from "@/components/ui/form/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useForm } from "react-hook-form";

export function CreateRawMaterial() {
    const { create } = useFormRawMat();

    const { utils } = useRawMaterialUtils();

    const categories = utils.data?.categories;
    const units = utils.data?.units;
    const suppliers = utils.data?.suppliers;

    const form = useForm<RequestRawMaterialDTO>({
        resolver: zodResolver(RequestRawMaterialSchema),
        defaultValues: {
            barcode: "",
            name: "",
            price: 0,
            min_buy: 0,
            min_stock: 0,
            supplier_id: null,
            raw_mat_category: "",
            unit: undefined,
        },
    });

    const onSubmit = async (body: RequestRawMaterialDTO) => {
        await create.mutateAsync(body);
        form.reset();
    };

    return (
        <>
            <Form
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-3 xl:grid-cols-4 2xl:w-8/12"
            >
                {/* LEFT */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl">Tambah Raw Material</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-5">
                        <InputForm
                            control={form.control}
                            disabled={utils.isLoading || create.isPending}
                            name="barcode"
                            label="Barcode"
                            placeholder="BARCODE (opsional)"
                            type="text"
                            error={form.formState.errors.barcode}
                        />

                        <InputForm
                            required
                            control={form.control}
                            disabled={utils.isLoading || create.isPending}
                            name="name"
                            label="Nama Material"
                            placeholder="Nama material"
                            error={form.formState.errors.name}
                        />

                        <InputForm
                            required
                            control={form.control}
                            name="price"
                            label="Harga"
                            disabled={utils.isLoading || create.isPending}
                            type="number"
                            error={form.formState.errors.price}
                        />
                        {/* 
                        <InputForm
                            control={form.control}
                            name="current_stock"
                            label="Stok Saat Ini"
                            type="number"
                            disabled={utils.isLoading || create.isPending}
                            error={form.formState.errors.current_stock}
                        /> */}

                        <InputForm
                            control={form.control}
                            name="min_stock"
                            disabled={utils.isLoading || create.isPending}
                            label="Minimum Stok"
                            type="number"
                            error={form.formState.errors.min_stock}
                        />

                        <InputForm
                            control={form.control}
                            name="min_buy"
                            label="Minimum Pembelian"
                            disabled={utils.isLoading || create.isPending}
                            type="number"
                            error={form.formState.errors.min_buy}
                        />
                    </CardContent>
                </Card>

                {/* RIGHT */}
                <Card>
                    <CardHeader className="flex gap-2">
                        <Button type="button" onClick={() => window.history.back()}>
                            <ArrowLeft /> Kembali
                        </Button>

                        <Button type="button" variant="warning" onClick={() => form.reset()}>
                            Reset <RefreshCcw />
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        <EnhancedCreatableCombobox
                            name="unit"
                            label="Unit"
                            isLoading={utils.isLoading || create.isPending}
                            placeholder="Contoh: Kg, Liter, Pcs"
                            options={
                                units?.map((u) => ({
                                    value: u.slug,
                                    label: u.name,
                                })) || []
                            }
                        />
                        <EnhancedCreatableCombobox
                            name="raw_mat_category"
                            label="Kategori Material"
                            placeholder="Pilih / buat kategori"
                            isLoading={utils.isLoading || create.isPending}
                            options={
                                categories?.map((c) => ({
                                    value: c.slug,
                                    label: c.name,
                                })) || []
                            }
                        />
                        <SelectForm
                            label="Supplier"
                            name="supplier_id"
                            canSearching
                            isLoading={utils.isLoading || create.isPending}
                            control={form.control}
                            options={suppliers?.map((s) => ({
                                value: s.id,
                                label: `${s.name} (${s.country})`,
                            }))}
                        />
                    </CardContent>

                    <CardFooter>
                        <Button className="w-full" disabled={create.isPending} variant="teal">
                            {create.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                            Simpan
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
            <LogData data={utils.data} />
        </>
    );
}
