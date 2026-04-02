"use client";

import { RequestIssuanceDTO, RequestIssuanceSchema } from "@/app/(application)/product-issuance/server/issuance.schema";
import { QueryDetailIssuance } from "@/app/(application)/product-issuance/server/issuance.service";
import { useFormIssuance, useIssuance } from "@/app/(application)/product-issuance/server/use.issuance";
import { useProducts } from "@/app/(application)/products/server/use.products";
import { ISSUANCE_TYPE } from "@/shared/types";
import { SelectForm } from "@/components/ui/form/select";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save, Calendar, Info } from "lucide-react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";

export function EditIssuance() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = useParams();

    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));
    const type = searchParams.get("type") || "ALL";

    const query: QueryDetailIssuance = {
        product_id: Number(id),
        month,
        year,
        type,
    };

    const { issuance, isLoading, isFetching } = useIssuance(undefined, query);

    const products = useProducts({
        status: "ACTIVE",
        take: 1000,
        sortBy: "name",
        sortOrder: "asc",
    });

    const productOptions = useMemo(() => {
        const uniqueProducts = new Map();

        products.data?.forEach((p) => {
            if (!uniqueProducts.has(p.id)) {
                uniqueProducts.set(p.id, {
                    label: `(${p.code}) ${p.name} ${String(
                        p.product_type?.name || "NON-TYPE",
                    ).toUpperCase()} ${p.size?.size} ML`,
                    value: p.id,
                });
            }
        });

        return Array.from(uniqueProducts.values());
    }, [products.data]);

    const form = useForm<RequestIssuanceDTO>({
        resolver: zodResolver(RequestIssuanceSchema),
        defaultValues: {
            quantity: 0,
            month,
            year,
            type: type as any,
            product_id: Number(id),
        },
    });

    useEffect(() => {
        if (issuance) {
            form.reset({
                quantity: Number(issuance.quantity),
                month,
                year,
                type: type as any,
                product_id: Number(id),
            });
        }
    }, [issuance, form, month, year, id, type]);

    const { update } = useFormIssuance(form);

    const onSubmit = async (body: RequestIssuanceDTO) => {
        await update.mutateAsync(body);
    };

    const isPending = update.isPending;
    const isInitialLoading = isLoading && !issuance;

    // Helper for display period
    const periodLabel = new Date(year, month - 1).toLocaleString("id-ID", {
        month: "long",
        year: "numeric",
    });

    if (isInitialLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="col-span-2 h-[300px] rounded-xl" />
                    <Skeleton className="h-[200px] rounded-xl" />
                </div>
            </div>
        );
    }

    if (!issuance) return null;

    return (
        <section className="w-full">
            <Form
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6 lg:grid-cols-12"
            >
                {/* Kolom Kiri: Form Input */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b bg-white/50">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <div className="h-4 w-1 bg-primary rounded-full" />
                                Edit Data Pengeluaran
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 text-primary font-medium">
                                <span className="font-bold underline underline-offset-4 decoration-primary/30">
                                    {issuance.product.name}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3.5" />
                                    {periodLabel}
                                </span>
                                <span>•</span>
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                    {type}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-8 pt-8 relative">
                            {isFetching && (
                                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            )}

                            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex gap-3">
                                <Info className="size-5 text-amber-500 shrink-0" />
                                <div className="text-xs text-amber-700 leading-relaxed">
                                    <strong>Peringatan:</strong> Mengubah data pengeluaran yang sudah
                                    ada dapat memengaruhi perhitungan stok pengaman (Safety Stock)
                                    dan rekomendasi produksi di masa depan. Pastikan data yang Anda
                                    perbarui adalah data final yang valid.
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectForm
                                    required
                                    name="product_id"
                                    control={form.control}
                                    label="Produk"
                                    canSearching
                                    options={productOptions}
                                    placeholder="Pilih produk..."
                                    error={form.formState.errors.product_id}
                                    isLoading={isPending}
                                />

                                <InputForm
                                    required
                                    name="quantity"
                                    control={form.control}
                                    label="Jumlah Pengeluaran Aktual"
                                    type="number"
                                    placeholder="2000"
                                    error={form.formState.errors.quantity}
                                    disabled={isPending}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectForm
                                    required
                                    name="type"
                                    control={form.control}
                                    label="Tipe Pengeluaran"
                                    options={ISSUANCE_TYPE.map((t) => ({
                                        label: t.replace("_", " "),
                                        value: t,
                                    }))}
                                    placeholder="Pilih tipe..."
                                    error={form.formState.errors.type}
                                    isLoading={isPending}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Actions */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="h-fit border-none shadow-sm pt-0 rounded-xl overflow-hidden sticky top-6">
                        <CardHeader className="bg-slate-50 border-b pt-4">
                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isPending}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => form.reset()}
                                    disabled={isPending}
                                    className="text-muted-foreground"
                                >
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs py-2 border-b">
                                    <span className="text-muted-foreground uppercase tracking-wider">
                                        Tipe Produk
                                    </span>
                                    <span className="font-bold uppercase italic text-slate-700">
                                        {issuance.product.product_type?.name ?? "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs py-2 border-b">
                                    <span className="text-muted-foreground uppercase tracking-wider">
                                        Periode Data
                                    </span>
                                    <span className="font-bold text-slate-700">
                                        {month}/{year}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Button
                                className="w-full h-11 cursor-pointer font-bold shadow-md shadow-primary/20"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        Menyimpan...{" "}
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Update Data <Save className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </Form>
        </section>
    );
}
