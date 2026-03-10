"use client";

import { useSizes } from "@/app/(application)/products/(component)/size/server/use.size";
import { useType } from "@/app/(application)/products/(component)/type/server/use.type";
import { useUnit } from "@/app/(application)/products/(component)/unit/server/use.unit";
import {
    RequestProductDTO,
    RequestProductSchema,
} from "@/app/(application)/products/server/products.schema";
import { useFormProduct } from "@/app/(application)/products/server/use.products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EnhancedCreatableCombobox } from "@/components/ui/form/createable.combobox";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { SelectForm } from "@/components/ui/form/select";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Box, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const GENDER_OPTIONS = [
    { value: "UNISEX", label: "Unisex" },
    { value: "MEN", label: "Pria" },
    { value: "WOMEN", label: "Wanita" },
];

const Z_LEVEL_OPTIONS = [
    { value: "1.28", label: "90% (1.28)" },
    { value: "1.65", label: "95% (1.65)" },
    { value: "1.96", label: "97.5% (1.96)" },
    { value: "2.33", label: "99% (2.33)" },
    { value: "3.09", label: "99.9% (3.09)" },
];

export function CreateProduct() {
    const router = useRouter();
    const { create } = useFormProduct();

    const [typeSearch, setTypeSearch] = useState("");
    const [unitSearch, setUnitSearch] = useState("");
    const [sizeSearch, setSizeSearch] = useState("");

    const debouncedTypeSearch = useDebounce(typeSearch, 400);
    const debouncedUnitSearch = useDebounce(unitSearch, 400);
    const debouncedSizeSearch = useDebounce(sizeSearch, 400);

    const {
        data: typeList,
        isLoading: typesLoading,
        isError: typesError,
        refetch: typeRefetch,
    } = useType({ search: debouncedTypeSearch || undefined });

    const {
        data: unitList,
        isLoading: unitsLoading,
        isError: unitsError,
        refetch: unitRefetch,
    } = useUnit({ search: debouncedUnitSearch || undefined });

    const {
        data: sizeList,
        isLoading: sizesLoading,
        isError: sizesError,
        refetch: sizeRefetch,
    } = useSizes({
        search: debouncedSizeSearch ? Number(debouncedSizeSearch) : undefined,
    });

    const form = useForm<RequestProductDTO>({
        resolver: zodResolver(RequestProductSchema),
        defaultValues: {
            code: "",
            name: "",
            size: 0,
            gender: "UNISEX",
            status: "ACTIVE",
            product_type: null,
            unit: null,
            lead_time: 0,
            review_period: 0,
            z_value: 1.65,
            distribution_percentage: 0,
            safety_percentage: 0,
        },
    });

    const onSubmit = async (body: RequestProductDTO) => {
        await create.mutateAsync(body);
        router.push("/products");
    };

    return (
        <div className="w-full relative pb-12">
            <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                {/* ── STICKY HEADER ── */}
                <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b mb-8 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-5">
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => router.back()}
                                className="h-9 w-9 shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-black flex items-center gap-2">
                                    <Box className="h-6 w-6 text-muted-foreground" />
                                    Tambah Produk Baru
                                </h1>
                                <p className="text-sm text-muted-foreground hidden sm:block">
                                    Lengkapi informasi dasar, atribut, dan parameter stok produk.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-3 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="warning"
                                onClick={() => form.reset()}
                                className="w-full md:w-auto"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                            <Button
                                type="submit"
                                variant="info"
                                className="w-full md:w-auto"
                                disabled={create.isPending}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {create.isPending ? "Menyimpan..." : "Simpan Produk"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── MAIN LAYOUT ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-1">
                    {/* Kolom Kiri — 2/3 layar */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Card: Informasi Dasar */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium">
                                    Informasi Dasar
                                </CardTitle>
                                <CardDescription>
                                    Identitas utama produk untuk pencatatan sistem.
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputForm
                                    required
                                    control={form.control}
                                    name="code"
                                    label="Kode Produk (SKU)"
                                    placeholder="Contoh: PRD-001"
                                    type="text"
                                    autoFocus
                                    error={form.formState.errors.code}
                                />
                                <InputForm
                                    required
                                    control={form.control}
                                    name="name"
                                    label="Nama Produk"
                                    placeholder="Contoh: Parfum Aroma Kopi"
                                    type="text"
                                    error={form.formState.errors.name}
                                />
                            </CardContent>
                        </Card>

                        {/* Card: Manajemen Stok ROP */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium">
                                    Manajemen Stok (ROP)
                                </CardTitle>
                                <CardDescription>
                                    Parameter otomatisasi Reorder Point.
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <SelectForm
                                    name="z_value"
                                    control={form.control}
                                    label="Service Level (Z)"
                                    options={Z_LEVEL_OPTIONS}
                                    placeholder="Pilih Z-Level"
                                    error={form.formState.errors.z_value}
                                />
                                <InputForm
                                    required
                                    control={form.control}
                                    name="lead_time"
                                    label="Lead Time (Hari)"
                                    placeholder="0"
                                    type="number"
                                    error={form.formState.errors.lead_time}
                                />
                                <InputForm
                                    required
                                    control={form.control}
                                    name="review_period"
                                    label="Review Period (Hari)"
                                    placeholder="0"
                                    type="number"
                                    error={form.formState.errors.review_period}
                                />
                                <InputForm
                                    control={form.control}
                                    name="distribution_percentage"
                                    label="Persentase Edar (EDAR)"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    error={form.formState.errors.distribution_percentage}
                                />
                                <InputForm
                                    control={form.control}
                                    name="safety_percentage"
                                    label="Safety Stock (%)"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    error={form.formState.errors.safety_percentage}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan — 1/3 layar: Atribut Produk */}
                    <div className="xl:col-span-1 space-y-6">
                        <Card className="shadow-sm bg-muted/30">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium">
                                    Atribut Produk
                                </CardTitle>
                                <CardDescription>
                                    Spesifikasi dan varian fisik material. Ketik untuk mencari
                                    langsung ke database.
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-6 space-y-5">
                                {/* Tipe Material — server-side search */}
                                <EnhancedCreatableCombobox
                                    required
                                    name="product_type"
                                    label="Tipe Material"
                                    placeholder="Ketik untuk mencari tipe..."
                                    options={
                                        typeList?.map((s) => ({
                                            value: s.name,
                                            label: s.name,
                                            id: s.id,
                                        })) || []
                                    }
                                    isLoading={typesLoading}
                                    isError={typesError}
                                    refetch={typeRefetch}
                                    onSearchChange={setTypeSearch}
                                />
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Ukuran — server-side search (angka) */}
                                    <EnhancedCreatableCombobox
                                        name="size"
                                        label="Ukuran"
                                        placeholder="Ketik angka ukuran..."
                                        options={
                                            sizeList?.map((s) => ({
                                                value: String(s.size),
                                                label: String(s.size),
                                                id: s.id,
                                            })) || []
                                        }
                                        isLoading={sizesLoading}
                                        isError={sizesError}
                                        refetch={sizeRefetch}
                                        onSearchChange={setSizeSearch}
                                    />

                                    {/* Unit of Material — server-side search */}
                                    <EnhancedCreatableCombobox
                                        name="unit"
                                        label="Unit (UoM)"
                                        placeholder="Ketik untuk mencari unit..."
                                        options={
                                            unitList?.map((s) => ({
                                                value: s.name,
                                                label: s.name,
                                                id: s.id,
                                            })) || []
                                        }
                                        isLoading={unitsLoading}
                                        isError={unitsError}
                                        refetch={unitRefetch}
                                        onSearchChange={setUnitSearch}
                                    />
                                </div>

                                {/* Gender */}
                                <SelectForm
                                    name="gender"
                                    control={form.control}
                                    label="Gender"
                                    options={GENDER_OPTIONS}
                                    placeholder="Pilih gender..."
                                    error={form.formState.errors.gender}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Form>
        </div>
    );
}
