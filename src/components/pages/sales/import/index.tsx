"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Upload,
    FileText,
    Database,
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    Container,
    CheckCircle,
    Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { SelectForm } from "@/components/ui/form/select";
import { PreviewTable } from "./preview";

import {
    useExecuteImportSales,
    useGetPreviewImport,
    usePreviewImportSales,
} from "@/app/(application)/sales/import/server/use.import";
import { SalesImportPreviewDTO } from "@/app/(application)/sales/import/server/import.schema";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ResultDialog } from "./result.dialog";
import { SALES_TYPE } from "@/shared/types";

/* Options */

type Option = { label: string; value: number };

const MONTH_OPTIONS: Option[] = [
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

const YEAR_OPTIONS: Option[] = (() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 7 }).map((_, i) => {
        const year = currentYear - 5 + i;
        return { label: String(year), value: year };
    });
})();

/* Types */

type ImportSalesFormValues = {
    month: number;
    year: number;
    type: string;
};

const MAX_ROWS = 5000;

export function ImportSalesForm() {
    const router = useRouter();
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const searchParams = useSearchParams();
    const defaultType = searchParams.get("type") || "ALL";

    const form = useForm<ImportSalesFormValues>({
        defaultValues: {
            month: prevMonthDate.getMonth() + 1,
            year: prevMonthDate.getFullYear(),
            type: defaultType,
        },
    });

    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [rows, setRows] = useState<SalesImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });
    const [openDialog, setOpenDialog] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);

    const typeLabel = useMemo(() => {
        const t = form.watch("type") || defaultType;
        return t.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    }, [form.watch("type"), defaultType]);

    const previewMutation = usePreviewImportSales();
    const getPreviewMutation = useGetPreviewImport();
    const executeMutation = useExecuteImportSales();

    async function handlePreview() {
        if (!file) return;

        const preview = await previewMutation.mutateAsync(file);

        setImportId(preview.import_id);
        setStats({
            total: preview.total,
            valid: preview.valid,
            invalid: preview.invalid,
        });

        const detail = await getPreviewMutation.mutateAsync(preview.import_id);
        setRows(detail.rows);

        toast.success("Preview generated", {
            description: `${preview.total} rows (${preview.valid} valid, ${preview.invalid} invalid)`,
        });
    }

    async function handleExecute() {
        if (!importId || stats.invalid > 0) return;

        const { month, year, type } = form.getValues();

        const result = await executeMutation.mutateAsync({
            importId,
            month,
            year,
            type,
        });

        setImportResult(result);

        toast.success("Import completed");

        setOpenDialog(false);
        setImportId(null);
        setRows([]);
        setStats({ total: 0, valid: 0, invalid: 0 });
        setFile(null);
    }

    return (
        <div className="space-y-6 w-full pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-10 w-10 hover:bg-slate-100"
                        onClick={() => router.push("/sales")}
                    >
                        <ArrowLeft className="size-5" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Import Data Sales {typeLabel}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Upload pencapaian penjualan {typeLabel.toLowerCase()} bulanan untuk diproses menjadi forecast
                            kebutuhan.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        target="_blank"
                        href="https://docs.google.com/spreadsheets/d/1DoTlWLwf2k1rU_9vCvG2znZ01Teu7PWOzfOmD08DFLk/edit?usp=sharing"
                    >
                        <Button
                            variant="outline"
                            className="shadow-sm border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                        >
                            <Container className="mr-2 h-4 w-4" /> Download Template
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Upload className="h-4 w-4 text-primary" />
                            File Upload
                        </CardTitle>
                        <CardDescription>
                            Format yang didukung: CSV, XLSX (Maksimal {MAX_ROWS} baris)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <label className="group relative border-dashed border-2 border-slate-200 rounded-xl p-10 block text-center cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all duration-200">
                            <input
                                hidden
                                type="file"
                                accept=".csv,.xlsx"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                                    <Upload className="h-6 w-6 text-slate-500 group-hover:text-primary" />
                                </div>
                                <span className="text-lg font-medium text-slate-700 block mb-1">
                                    {file ? file.name : "Klik atau seret file ke sini"}
                                </span>
                                <span className="text-sm text-slate-400">
                                    {file
                                        ? `${(file.size / 1024).toFixed(2)} KB`
                                        : "Excel atau CSV (Maks 5MB)"}
                                </span>
                            </div>
                        </label>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 shadow-sm"
                                onClick={handlePreview}
                                disabled={!file || previewMutation.isPending}
                            >
                                {previewMutation.isPending ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileText className="mr-2 h-4 w-4" />
                                )}
                                Preview Data
                            </Button>

                            <Button
                                size="lg"
                                className="px-8 shadow-md"
                                onClick={() => setOpenDialog(true)}
                                disabled={
                                    !importId || stats.valid === 0 || executeMutation.isPending
                                }
                            >
                                <Database className="mr-2 h-4 w-4" />
                                Jalankan Import
                            </Button>
                        </div>

                        {stats.invalid > 0 && (
                            <Alert
                                variant="default"
                                className="bg-amber-50 border-amber-200 text-amber-800 rounded-lg shadow-sm [&>svg]:text-amber-500"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Terdapat <strong>{stats.invalid} baris tidak valid</strong>.
                                    Hanya <strong>{stats.valid} baris valid</strong> yang akan
                                    diproses.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {importId && (
                    <Card className="border-none shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="bg-slate-50/50 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                    Pratinjau Data Import
                                </CardTitle>
                                <div className="flex gap-2">
                                    <div className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                        {stats.valid} Valid
                                    </div>
                                    <div className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                        {stats.invalid} Invalid
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Tabs defaultValue="preview" className="w-full">
                                <TabsList className="bg-slate-100/80 p-1 mb-6">
                                    <TabsTrigger value="preview" className="px-6">
                                        Preview ({stats.valid})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="errors"
                                        className="px-6 text-red-600 data-[state=active]:bg-red-50"
                                    >
                                        Invalid Data ({stats.invalid})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="preview" className="mt-0">
                                    <div className="rounded-lg border border-slate-100 overflow-hidden shadow-sm bg-white">
                                        <PreviewTable rows={rows} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="errors" className="mt-0">
                                    <div className="rounded-lg border border-red-100 overflow-hidden shadow-sm bg-white">
                                        {rows.filter((r) => r.errors.length).length === 0 ? (
                                            <div className="py-12 text-center bg-white">
                                                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-600">
                                                    Tidak ada data error yang ditemukan.
                                                </p>
                                            </div>
                                        ) : (
                                            <PreviewTable
                                                rows={rows.filter((r) => r.errors.length)}
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Pilih Periode {typeLabel}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <p className="text-sm text-slate-500">
                            Silakan tentukan bulan dan tahun periode sales yang sedang diimport.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <SelectForm
                                name="month"
                                label="Bulan"
                                required
                                control={form.control}
                                options={MONTH_OPTIONS}
                                onValueChange={(v) => form.setValue("month", Number(v))}
                            />

                            <SelectForm
                                name="year"
                                label="Tahun"
                                required
                                control={form.control}
                                options={YEAR_OPTIONS}
                                onValueChange={(v) => form.setValue("year", Number(v))}
                            />

                            <SelectForm
                                name="type"
                                label="Tipe Penjualan"
                                required
                                control={form.control}
                                options={SALES_TYPE.map((t) => ({
                                    label: t.replace("_", " "),
                                    value: t,
                                }))}
                                onValueChange={(v) => form.setValue("type", String(v))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleExecute}
                            disabled={executeMutation.isPending}
                            className="bg-primary shadow-md"
                        >
                            {executeMutation.isPending ? "Memproses..." : "Konfirmasi & Import"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ResultDialog
                result={importResult}
                dryRun={false}
                open={!!importResult}
                onOpenChange={() => setImportResult(null)}
                typeLabel={typeLabel}
            />
        </div>
    );
}
