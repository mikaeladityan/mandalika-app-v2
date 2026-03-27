"use client";

import { useSizes } from "@/app/(application)/products/(component)/size/server/use.size";
import { useType } from "@/app/(application)/products/(component)/type/server/use.type";
import { useUnit } from "@/app/(application)/products/(component)/unit/server/use.unit";
import {
    RequestProductDTO,
    RequestProductSchema,
    ResponseProductDTO,
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
import { cn } from "@/lib/utils";
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

// ─── Reusable Form Body ────────────────────────────────────────────────────
// Used both inside Dialog (desktop) and in the standalone Page (mobile).

interface CreateProductBodyProps {
    onSuccess?: (item: ResponseProductDTO) => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function CreateProductBody({
    onSuccess,
    onCancel,
    pageMode = false,
}: CreateProductBodyProps) {
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
        const res = await create.mutateAsync(body);
        if (onSuccess) {
            onSuccess(res as ResponseProductDTO);
        } else {
            router.push("/products");
        }
    };

    const renderCard = (title: string, description: string, children: React.ReactNode, className?: string) => {
        if (!pageMode) {
            return (
                <div className={cn("space-y-4", className)}>
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            );
        }
        return (
            <Card className={cn("shadow-sm", className)}>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">{children}</CardContent>
            </Card>
        );
    };

    const Actions = (
        <div className={cn("flex items-center gap-3", !pageMode ? "justify-end pt-6 border-t mt-4" : "w-full sm:w-auto")}>
            <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={onCancel || (() => router.back())}
                className={cn(!pageMode ? "flex" : "hidden")}
            >
                Batal
            </Button>
            <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1 sm:flex-none"
            >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button
                size="sm"
                type="submit"
                variant="default"
                className="flex-1 sm:flex-none"
                disabled={create.isPending}
            >
                <Save className="mr-2 h-4 w-4" />
                {create.isPending ? "Menyimpan..." : "Simpan Produk"}
            </Button>
        </div>
    );

    return (
        <div className="w-full relative">
            <Form methods={form} onSubmit={form.handleSubmit(onSubmit)}>
                {/* ── STICKY HEADER — page mode only ── */}
                {pageMode && (
                    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b mb-8 rounded-xl">
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
                                        Tambah Produk Baru
                                    </h1>
                                    <p className="text-sm text-muted-foreground hidden sm:block">
                                        Lengkapi informasi dasar, atribut, dan parameter stok produk.
                                    </p>
                                </div>
                            </div>
                            {Actions}
                        </div>
                    </div>
                )}

                {/* ── MAIN LAYOUT ── */}
                <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8", !pageMode ? "px-1" : "px-1 pb-12")}>
                    {/* Kolom Kiri — 2/3 layar */}
                    <div className="md:col-span-2 space-y-8">
                        {renderCard(
                            "Informasi Dasar",
                            "Identitas utama produk untuk pencatatan sistem.",
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>
                        )}

                        {renderCard(
                            "Manajemen Stok (ROP)",
                            "Parameter otomatisasi Reorder Point.",
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan — 1/3 layar */}
                    <div className="md:col-span-1 space-y-8">
                        {renderCard(
                            "Atribut Produk",
                            "Spesifikasi dan varian fisik material.",
                            <div className="space-y-5">
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
                                <div className="grid grid-cols-1 gap-4">
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
                                <SelectForm
                                    name="gender"
                                    control={form.control}
                                    label="Gender"
                                    options={GENDER_OPTIONS}
                                    placeholder="Pilih gender..."
                                    error={form.formState.errors.gender}
                                />
                            </div>
                        )}
                        {!pageMode && Actions}
                    </div>
                </div>
            </Form>
        </div>
    );
}

// ─── Standalone Page Component (still used for mobile) ─────────────────────

export function CreateProduct() {
    return (
        <div className="w-full relative pb-12">
            <CreateProductBody pageMode />
        </div>
    );
}
