"use client";

import { RequestSalesDTO, RequestSalesSchema } from "@/app/(application)/sales/server/sales.schema";
import { SALES_TYPE } from "@/shared/types";
import { useFormSales, useSales } from "@/app/(application)/sales/server/use.sales";
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
import { SelectForm } from "@/components/ui/form/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Send, CalendarDays, Info, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";

export function CreateSales() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultType = searchParams.get("type") || "ALL";

    // LOGIKA DINAMIS M-1
    const getInitialPeriod = () => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1); // Mundur 1 bulan
        return {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            label: date.toLocaleString("id-ID", { month: "long", year: "numeric" }),
        };
    };

    const period = getInitialPeriod();

    const form = useForm<RequestSalesDTO>({
        resolver: zodResolver(RequestSalesSchema),
        defaultValues: {
            quantity: 0,
            year: period.year,
            month: period.month,
            type: defaultType as any,
        },
    });

    const { create } = useFormSales(form);
    const { productsOption } = useSales();

    // Fetch products manually on mount
    useEffect(() => {
        productsOption.refetch();
    }, []);

    const productOptions = useMemo(() => {
        return (
            productsOption.data?.map((p) => ({
                label: `(${p.code}) ${p.name} ${String(p.type).toUpperCase()}`,
                value: p.id,
            })) ?? []
        );
    }, [productsOption.data]);

    const onSubmit = async (body: RequestSalesDTO) => {
        await create.mutateAsync({
            ...body,
            quantity: Number(body.quantity),
        });
    };

    const isPending = create.isPending;
    const isLoadingOptions = productsOption.isLoading;

    if (isLoadingOptions) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="col-span-2 h-[400px] rounded-xl" />
                    <Skeleton className="h-[200px] rounded-xl" />
                </div>
            </div>
        );
    }

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
                                Input Data Penjualan Aktual
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                                <CalendarDays className="size-4" />
                                Periode: {period.label}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-8 pt-8">
                            {/* Information Banner */}
                            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
                                <Info className="size-5 text-blue-500 shrink-0" />
                                <div className="text-xs text-blue-700 leading-relaxed">
                                    <strong>Panduan:</strong> Data yang Anda masukkan akan digunakan
                                    sebagai data historis untuk proses{" "}
                                    <b>Forecasting (BOM & Raw Material)</b>. Pastikan angka yang
                                    diinput sesuai dengan laporan penjualan aktual dari sistem POS
                                    atau Marketplace.
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
                                    label="Total Quantity Terjual (Aktual)"
                                    type="number"
                                    placeholder="Contoh: 2500"
                                    error={form.formState.errors.quantity}
                                    disabled={isPending}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectForm
                                    required
                                    name="type"
                                    control={form.control}
                                    label="Tipe Penjualan"
                                    options={SALES_TYPE.map((t) => ({
                                        label: t.replace("_", " "),
                                        value: t,
                                    }))}
                                    placeholder="Pilih tipe..."
                                    error={form.formState.errors.type}
                                    isLoading={isPending}
                                />
                            </div>

                            {/* Hidden Fields untuk memastikan month/year terkirim */}
                            <input type="hidden" {...form.register("month")} />
                            <input type="hidden" {...form.register("year")} />
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Actions */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="h-fit pt-0 border-none shadow-sm rounded-xl overflow-hidden sticky top-6">
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
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 mb-6">
                                <h4 className="text-sm font-bold text-slate-900 mb-1">
                                    Status Recon
                                </h4>
                                <p className="text-xs text-muted-foreground italic">
                                    Data untuk bulan {period.label} sedang dalam tahap pengumpulan
                                    data aktual sebelum dilakukan Reconcile.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Button
                                className="w-full h-11 cursor-pointer font-bold shadow-md shadow-primary/20"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        Memproses...{" "}
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Simpan Penjualan <Save className="ml-2 h-4 w-4" />
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
