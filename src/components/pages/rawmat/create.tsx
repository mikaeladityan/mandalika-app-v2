"use client";

import { useCategoriesQuery } from "@/app/(application)/rawmat/(component)/categories/server/use.category";
import {
    RequestRawMaterialDTO,
    RequestRawMaterialSchema,
} from "@/app/(application)/rawmat/server/rawmat.schema";
import { useFormRawMat } from "@/app/(application)/rawmat/server/use.rawmat";
import { useSuppliersQuery } from "@/app/(application)/rawmat/(component)/suppliers/server/use.supplier";
import { useUnitsQuery } from "@/app/(application)/rawmat/(component)/units/server/use.unit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ResponseRawMaterialDTO } from "@/app/(application)/rawmat/server/rawmat.schema";

// ─── Reusable Form Body ────────────────────────────────────────────────────
// Used both inside Dialog (desktop) and in the standalone Page (mobile).

interface CreateRawMaterialBodyProps {
    onSuccess?: (item: ResponseRawMaterialDTO) => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function CreateRawMaterialBody({
    onSuccess,
    onCancel,
    pageMode = false,
}: CreateRawMaterialBodyProps) {
    const router = useRouter();
    const { create } = useFormRawMat();

    const [categorySearch, setCategorySearch] = useState("");
    const [unitSearch, setUnitSearch] = useState("");
    const [supplierSearch, setSupplierSearch] = useState("");

    const debouncedCategorySearch = useDebounce(categorySearch, 400);
    const debouncedUnitSearch = useDebounce(unitSearch, 400);
    const debouncedSupplierSearch = useDebounce(supplierSearch, 400);

    const { data: categoryList, meta: categoryMeta } = useCategoriesQuery({
        search: debouncedCategorySearch || undefined,
        take: 50,
    });

    const { data: unitList, meta: unitMeta } = useUnitsQuery({
        search: debouncedUnitSearch || undefined,
        take: 50,
    });

    const { data: supplierList, meta: supplierMeta } = useSuppliersQuery({
        search: debouncedSupplierSearch || undefined,
        take: 50,
    });

    const form = useForm<RequestRawMaterialDTO>({
        resolver: zodResolver(RequestRawMaterialSchema),
        defaultValues: {
            barcode: "",
            name: "",
            price: 0,
            min_buy: 0,
            min_stock: 0,
            supplier_id: null as any,
            raw_mat_category: "",
            unit: "",
        },
    });

    const onSubmit = async (body: RequestRawMaterialDTO) => {
        const res = await create.mutateAsync(body);
        if (onSuccess) {
            onSuccess(res as ResponseRawMaterialDTO);
        } else {
            form.reset();
            router.push("/rawmat");
        }
    };

    return (
        <div className="w-full relative">
            <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                {/* ── STICKY HEADER — page mode only ── */}
                {pageMode && (
                    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b mb-8 rounded-xl outline-none">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-5">
                            <div className="flex items-center gap-3">
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="h-9 w-9 shrink-0"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <h1 className="text-xl font-black flex items-center gap-2">
                                        <Box className="h-6 w-6 text-muted-foreground" />
                                        Tambah Raw Material
                                    </h1>
                                    <p className="text-sm text-muted-foreground hidden sm:block">
                                        Lengkapi informasi dasar, detail pembelian, stok, dan
                                        klasifikasi.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-3 w-full sm:w-auto">
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    className="w-full md:w-auto"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    variant="default"
                                    className="w-full md:w-auto"
                                    disabled={create.isPending}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {create.isPending ? "Menyimpan..." : "Simpan Material"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MAIN LAYOUT ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-1">
                    {/* Kolom Kiri — 2/3 layar */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Card: Informasi Dasar */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="text-lg font-medium">
                                    Informasi Dasar
                                </CardTitle>
                                <CardDescription>
                                    Identitas utama material untuk pencatatan sistem.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputForm
                                    control={form.control}
                                    name="barcode"
                                    label="Barcode (Opsional)"
                                    placeholder="Contoh: 1234567890123"
                                    type="text"
                                    autoFocus
                                    error={form.formState.errors.barcode}
                                />
                                <InputForm
                                    required
                                    control={form.control}
                                    name="name"
                                    label="Nama Material"
                                    placeholder="Contoh: Biji Kopi Arabika"
                                    type="text"
                                    error={form.formState.errors.name}
                                />
                            </CardContent>
                        </Card>

                        {/* Card: Manajemen Harga dan Stok */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="text-lg font-medium">
                                    Harga dan Perencanaan Stok
                                </CardTitle>
                                <CardDescription>
                                    Parameter perencanaan pembelian dan batas aman stock minimum.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <InputForm
                                    required
                                    control={form.control}
                                    name="price"
                                    label="Harga (Rp)"
                                    placeholder="0"
                                    type="number"
                                    error={form.formState.errors.price}
                                />
                                <InputForm
                                    control={form.control}
                                    name="min_buy"
                                    label="Minimum Pembelian"
                                    placeholder="0"
                                    type="number"
                                    error={form.formState.errors.min_buy}
                                />
                                <InputForm
                                    control={form.control}
                                    name="min_stock"
                                    label="Minimum Stok"
                                    placeholder="0"
                                    type="number"
                                    error={form.formState.errors.min_stock}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan — 1/3 layar: Klasifikasi dan Pemasok */}
                    <div className="xl:col-span-1 space-y-6">
                        <Card className="shadow-sm bg-muted/30">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="text-lg font-medium">
                                    Klasifikasi & Pemasok
                                </CardTitle>
                                <CardDescription>
                                    Asal usul barang dan spesifikasi unit fisik material. Ketik
                                    untuk mencari.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                {/* Unit of Material — server-side search */}
                                <EnhancedCreatableCombobox
                                    required
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
                                    isLoading={unitMeta.isLoading || unitMeta.isFetching}
                                    isError={unitMeta.isError}
                                    refetch={unitMeta.refetch}
                                    onSearchChange={setUnitSearch}
                                />

                                {/* Kategori Material — server-side search */}
                                <EnhancedCreatableCombobox
                                    name="raw_mat_category"
                                    label="Kategori Material"
                                    placeholder="Ketik untuk mencari kategori..."
                                    options={
                                        categoryList?.map((c) => ({
                                            value: c.name,
                                            label: c.name,
                                            id: c.id,
                                        })) || []
                                    }
                                    isLoading={categoryMeta.isLoading || categoryMeta.isFetching}
                                    isError={categoryMeta.isError}
                                    refetch={categoryMeta.refetch}
                                    onSearchChange={setCategorySearch}
                                />

                                {/* Supplier */}
                                <SelectForm
                                    name="supplier_id"
                                    control={form.control}
                                    label="Supplier"
                                    canSearching
                                    isLoading={supplierMeta.isLoading || supplierMeta.isFetching}
                                    options={supplierList?.map((s) => ({
                                        value: String(s.id),
                                        label: `${s.name} (${s.country})`,
                                    }))}
                                    placeholder="Pilih supplier..."
                                    error={form.formState.errors.supplier_id}
                                />
                            </CardContent>
                        </Card>

                        {/* Dialog footer actions (non-page mode) */}
                        {!pageMode && (
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    onClick={onCancel}
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    variant="default"
                                    disabled={create.isPending}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {create.isPending ? "Menyimpan..." : "Simpan Material"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
}

// ─── Standalone Page Component (still used for mobile) ─────────────────────

export function CreateRawMaterial() {
    return (
        <div className="w-full relative pb-12">
            <CreateRawMaterialBody pageMode />
        </div>
    );
}
