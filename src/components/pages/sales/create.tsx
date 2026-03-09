"use client";

import { RequestSalesDTO, RequestSalesSchema } from "@/app/(application)/sales/server/sales.schema";
import { useFormSales, useSales } from "@/app/(application)/sales/server/use.sales";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { SelectForm } from "@/components/ui/form/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Send, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function CreateSales() {
    const router = useRouter();

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
        },
    });

    const { create } = useFormSales(form);
    const { products, isLoading, isFetching, isRefetching, isError } = useSales();

    const loading = isLoading || isFetching || isRefetching;

    useEffect(() => {
        if (isError) {
            router.push("/application/sales");
        }
    }, [isError, router]);

    const productOptions =
        products?.map((p) => ({
            label: `(${p.code}) ${p.name} ${p.type?.toUpperCase()}`,
            value: p.id,
        })) ?? [];

    const onSubmit = async (body: RequestSalesDTO) => {
        await create.mutateAsync({
            product_id: body.product_id,
            quantity: Number(body.quantity),
            month: body.month, // Gunakan nilai dari form (M-1)
            year: body.year, // Gunakan nilai dari form
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <section className="xl:max-w-4xl">
            <Card>
                <CardHeader className="space-y-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="w-fit"
                    >
                        <ArrowLeft />
                        Kembali
                    </Button>

                    <CardTitle className="flex flex-col gap-1">
                        Tambah Data Penjualan
                        <div className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                            <CalendarDays className="size-4 text-blue-500" />
                            Input aktual untuk periode:{" "}
                            <span className="font-bold text-foreground underline underline-offset-4">
                                {period.label}
                            </span>
                        </div>
                    </CardTitle>

                    <CardAction>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => form.reset()}
                            className="text-muted-foreground hover:text-warning"
                        >
                            <RefreshCcw className="size-4 mr-2" />
                            Reset Form
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <Form
                        methods={form}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Information Banner */}
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-[11px] text-blue-700">
                            <strong>Sistem Informasi:</strong> Data ini akan digunakan untuk proses{" "}
                            <b>Reconcile</b> bulan {period.label}. Pastikan angka yang diinput
                            sesuai dengan laporan tutup buku gudang.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <SelectForm
                                required
                                name="product_id"
                                control={form.control}
                                label="Produk"
                                canSearching
                                options={productOptions}
                                placeholder="Pilih produk"
                                error={form.formState.errors.product_id}
                                isLoading={create.isPending}
                            />

                            <InputForm
                                required
                                name="quantity"
                                control={form.control}
                                label="Total Quantity Terjual"
                                type="number"
                                placeholder="Contoh: 2500"
                                error={form.formState.errors.quantity}
                                disabled={create.isPending}
                            />
                        </div>

                        {/* Hidden Fields untuk memastikan month/year terkirim */}
                        <input type="hidden" {...form.register("month")} />
                        <input type="hidden" {...form.register("year")} />

                        <Button
                            type="submit"
                            variant="success"
                            className="w-full h-11 text-base font-semibold shadow-sm"
                            disabled={create.isPending}
                        >
                            {create.isPending ? (
                                <>
                                    Memproses... <Loader2 className="animate-spin ml-2" />
                                </>
                            ) : (
                                <>
                                    Simpan Data Aktual <Send className="ml-2 size-4" />
                                </>
                            )}
                        </Button>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
