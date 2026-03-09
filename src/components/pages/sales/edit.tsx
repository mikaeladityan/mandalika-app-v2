"use client";

import { RequestSalesDTO, RequestSalesSchema } from "@/app/(application)/sales/server/sales.schema";
import { QueryDetailSale } from "@/app/(application)/sales/server/sales.service";
import { useFormSales, useSales } from "@/app/(application)/sales/server/use.sales";
import { LogData } from "@/components/log";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Send } from "lucide-react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function EditSales() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = useParams();

    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));

    const query: QueryDetailSale = {
        product_id: Number(id),
        month,
        year,
    };

    const { sale, isError, isLoading, isFetching } = useSales(undefined, query);

    const form = useForm<RequestSalesDTO>({
        resolver: zodResolver(RequestSalesSchema),
        defaultValues: { quantity: 0, month, year, product_id: sale?.product_id },
    });

    useEffect(() => {
        if (isError) {
            router.push("/application/sales");
        }
    }, [isError, router]);

    useEffect(() => {
        if (sale) {
            form.reset({
                quantity: sale.quantity,
                month,
                year,
                product_id: sale.product_id,
            });
        }
    }, [sale, form]);

    const { update } = useFormSales(form);

    const onSubmit = async (body: RequestSalesDTO) => {
        await update.mutateAsync(body);
    };

    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (!sale) return null;

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

                    <CardTitle>
                        Update Penjualan
                        <div className="text-sm font-normal text-muted-foreground">
                            {sale.product.product_type?.name} {sale.product.name.toLowerCase()} —{" "}
                            {new Date(month - 1).toLocaleString("id-ID", {
                                month: "long",
                            })}{" "}
                            {year}
                        </div>
                    </CardTitle>

                    <CardAction>
                        <Button variant="warning" onClick={() => form.reset()}>
                            Reset
                            <RefreshCcw />
                        </Button>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <Form
                        methods={form}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end"
                    >
                        <InputForm
                            required
                            name="quantity"
                            control={form.control}
                            label="Jumlah Penjualan"
                            type="number"
                            placeholder="2000"
                            error={form.formState.errors.quantity}
                        />

                        <Button
                            type="submit"
                            variant="info"
                            className="w-full"
                            disabled={update.isPending}
                        >
                            Simpan
                            {update.isPending ? <Loader2 className="animate-spin" /> : <Send />}
                        </Button>
                    </Form>
                </CardContent>
            </Card>

            <LogData data={form.watch()} />
        </section>
    );
}
