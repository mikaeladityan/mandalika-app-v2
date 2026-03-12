"use client";

import { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, ArrowLeft, CalendarDays, PercentCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectFilter } from "@/components/ui/form/select";

import {
    useForecastPercentageList,
    useForecastPercentageMutations,
} from "@/app/(application)/forecasts/percentages/server/use.percentages";
import {
    RequestForecastPercentageBulkSchema,
    RequestForecastPercentageBulkDTO,
} from "@/app/(application)/forecasts/percentages/server/percentages.schema";
import { toast } from "sonner";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const MONTHS = [
    { label: "Januari", value: 1 },
    { label: "Februari", value: 2 },
    { label: "Maret", value: 3 },
    { label: "April", value: 4 },
    { label: "Mei", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "Agustus", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Desember", value: 12 },
];

const YEAR_OPTIONS = (() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }).map((_, i) => {
        const year = currentYear - 2 + i;
        return { label: String(year), value: year };
    });
})();

export function ForecastPercentages() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    // Fecth existing data for the selected year
    const { data: listData, isLoading: isFetching } = useForecastPercentageList({
        year: selectedYear,
        take: 12,
    });

    const { createBulk } = useForecastPercentageMutations();

    const form = useForm({
        resolver: zodResolver(RequestForecastPercentageBulkSchema) as any,
        defaultValues: {
            items: MONTHS.map((m) => ({ month: m.value, year: selectedYear, value: 0 })),
        },
    });

    // Sync form when year changes or data is fetched
    useEffect(() => {
        const existingItems = listData?.data || [];
        const items = MONTHS.map((month) => {
            const existing: any = existingItems.find(
                (item: any) => item.month === month.value && item.year === selectedYear,
            );
            return {
                month: month.value,
                year: selectedYear,
                value: existing ? Number((existing.value * 100).toFixed(2)) : 0,
            };
        });
        form.reset({ items });
    }, [listData, selectedYear, form]);

    async function onSubmit(data: RequestForecastPercentageBulkDTO) {
        // Parse % string and map to decimals (e.g. 25 -> 0.25)
        const mappedData = {
            ...data,
            items: data.items.map((item) => ({
                ...item,
                value: Number((item.value / 100).toFixed(4)), // db format
            })),
        };

        createBulk.mutate(mappedData, {
            onSuccess: () => {
                router.push("/forecasts");
                toast.success("Persentase proporsi penjualan berhasil disimpan");
                queryClient.invalidateQueries({ queryKey: ["forecast-percentages"] });
                queryClient.invalidateQueries({ queryKey: ["forecast"] });
                // if (
                //     findProduct.product_type?.slug === "parfum" ||
                //     findProduct.product_type?.slug === "edp"
                // ) {
                // }
            },
            onError: (error: any) => {
                toast.error(
                    error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
                );
            },
        });
    }

    // total calculation
    const currentValues = form.watch("items") || [];
    const totalPercentage = currentValues.reduce(
        (sum, item) => sum + (Number(item?.value) || 0),
        0,
    );

    return (
        <div className="flex flex-col gap-6 p-2 md:p-4">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="space-y-6 p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => router.push("/forecasts")}
                                    className="mr-2"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <PercentCircle className="h-5 w-5 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tight text-slate-900">
                                    Forecast Percentages
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 font-medium ml-18">
                                Atur persentase proporsi penjualan bulanan untuk kalkulasi
                                forecasting produksi.
                            </CardDescription>
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="w-full lg:w-64">
                            <SelectFilter
                                canSearching
                                options={YEAR_OPTIONS}
                                value={String(selectedYear)}
                                onChange={(val) => setSelectedYear(Number(val))}
                                disabled={isFetching || createBulk.isPending}
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 lg:p-8 pt-0">
                    {isFetching ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit as any)}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {(form.watch("items") || []).map((item: any, index: number) => {
                                        const monthLabel = MONTHS.find(
                                            (m) => m.value === item.month,
                                        )?.label;
                                        return (
                                            <FormField
                                                key={index}
                                                control={form.control}
                                                name={`items.${index}.value`}
                                                render={({ field }) => (
                                                    <FormItem className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                                        <FormLabel className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                                                            <CalendarDays className="h-4 w-4 text-indigo-500" />
                                                            {monthLabel}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    {...field}
                                                                    className="pr-8 h-11 border-slate-200 focus-visible:ring-indigo-500/20 font-medium text-slate-900"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                                    %
                                                                </span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        );
                                    })}
                                </div>

                                <Separator className="bg-slate-100" />

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-500">
                                            Total Persentase:
                                        </span>
                                        <span
                                            className={`text-xl font-black ${totalPercentage > 100 || totalPercentage < 0 ? "text-red-500" : "text-emerald-500"}`}
                                        >
                                            {totalPercentage.toFixed(2)}%
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/forecasts")}
                                            className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={createBulk.isPending}
                                            className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
                                        >
                                            {createBulk.isPending ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="mr-2 h-4 w-4" />
                                            )}
                                            Simpan Perubahan
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
