"use client";

import { useState, useMemo, useRef } from "react";
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
    ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
    useExecuteImportIssuance,
    useGetPreviewImport,
    usePreviewImportIssuance,
} from "@/app/(application)/product-issuance/import/server/use.import";
import { IssuanceImportPreviewDTO } from "@/app/(application)/product-issuance/import/server/import.schema";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ResultDialog } from "./result.dialog";
import { ISSUANCE_TYPE } from "@/shared/types";

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

type ImportIssuanceFormValues = {
    month: number;
    year: number;
    type: string;
};

const MAX_ROWS = 5000;

export function ImportIssuanceForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const searchParams = useSearchParams();
    const defaultType = searchParams.get("type") || "ALL";

    const form = useForm<ImportIssuanceFormValues>({
        defaultValues: {
            month: prevMonthDate.getMonth() + 1,
            year: prevMonthDate.getFullYear(),
            type: defaultType,
        },
    });

    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [rows, setRows] = useState<IssuanceImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });
    const [openDialog, setOpenDialog] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (selectedFile: File | null) => {
        if (!selectedFile) return;

        setFile(selectedFile);

        // Auto-select Type from filename (e.g., "... - OFFLINE" or "...-OFFLINE")
        // We use regex to be more flexible with spaces around the dash
        const fileName = selectedFile.name;
        const validTypes = ["OFFLINE", "ONLINE", "SPIN_WHEEL", "GARANSI_OUT"];

        for (const t of validTypes) {
            // Match any dash/space combination followed by the type
            const regex = new RegExp(`[-\\s]+${t}(\\.[^.]+|$)`, "i");
            if (regex.test(fileName)) {
                form.setValue("type", t, { shouldValidate: true, shouldDirty: true });
                toast.success(`Tipe pengeluaran otomatis disetel ke: ${t.replace("_", " ")}`, {
                    description: `Terdeteksi dari nama file "${fileName}"`,
                });
                break;
            }
        }
    };

    const typeLabel = useMemo(() => {
        const t = form.watch("type") || defaultType;
        return t
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase());
    }, [form.watch("type"), defaultType]);

    const previewMutation = usePreviewImportIssuance();
    const getPreviewMutation = useGetPreviewImport();
    const executeMutation = useExecuteImportIssuance();

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
        if (!importId || stats.valid === 0) return;

        const { month, year, type } = form.getValues();

        console.log("Executing import with type:", type); // Debug to ensure correct type is used

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
            {/* Header omitted */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-10 w-10 hover:bg-slate-100"
                        onClick={() => router.push("/product-issuance")}
                    >
                        <ArrowLeft className="size-5" />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="size-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                <ShoppingBag className="size-4" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Import Data Pengeluaran {typeLabel}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Upload data pengeluaran {typeLabel.toLowerCase()} bulanan untuk diproses
                            menjadi forecast kebutuhan.
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
                        <div
                            className={`group relative border-dashed border-2 rounded-xl p-10 block text-center cursor-pointer transition-all duration-300 ${
                                isDragging
                                    ? "border-primary bg-primary/10 scale-[1.02] shadow-lg ring-4 ring-primary/10"
                                    : "border-slate-200 hover:border-primary/50 hover:bg-slate-50 shadow-sm"
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDragging(true);
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isDragging) setIsDragging(true);
                                if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.currentTarget === e.target) {
                                    setIsDragging(false);
                                }
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDragging(false);
                                
                                const droppedFile = e.dataTransfer?.files?.[0];
                                if (droppedFile) {
                                    handleFileChange(droppedFile);
                                }
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                aria-hidden="true"
                                hidden
                                type="file"
                                accept=".csv,.xlsx"
                                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                            />
                            <div className={`flex flex-col items-center ${isDragging ? "pointer-events-none" : ""}`}>
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                                    <Upload className="h-6 w-6 text-slate-500 group-hover:text-primary" />
                                </div>
                                {file ? (
                                    <div className="space-y-2">
                                        <span className="text-lg font-bold text-primary block">
                                            {file.name}
                                        </span>
                                        <div className="flex items-center justify-center gap-2">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </Badge>
                                            {form.watch("type") && form.watch("type") !== "ALL" && (
                                                <Badge className="bg-emerald-500 text-white border-none">
                                                    Tipe: {form.watch("type")}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-lg font-medium text-slate-700 block mb-1">
                                            Klik atau seret file ke sini
                                        </span>
                                        <span className="text-sm text-slate-400">
                                            Excel atau CSV (Maks 5MB)
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

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
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Pilih Periode {typeLabel}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        {stats.invalid > 0 && (
                             <div className="p-4 rounded-xl border bg-amber-50 border-amber-100 text-amber-800 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold leading-none">Verifikasi Data Invalid</p>
                                    <p className="text-xs leading-relaxed">
                                        Terdeteksi <strong>{stats.invalid} baris tidak valid</strong>. 
                                        Hanya <strong>{stats.valid} baris valid</strong> yang akan diproses ke database. 
                                        Lanjutkan import sisa data yang valid?
                                    </p>
                                </div>
                            </div>
                        )}
                        <p className="text-sm text-slate-500">
                            Silakan tentukan bulan dan tahun periode pengeluaran yang sedang
                            diimport.
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

                            <div className="col-span-2">
                                <SelectForm
                                    name="type"
                                    label="Tipe Pengeluaran"
                                    required
                                    control={form.control}
                                    options={ISSUANCE_TYPE.map((t) => ({
                                        label: t.replace("_", " "),
                                        value: t,
                                    }))}
                                    onValueChange={(v) => form.setValue("type", String(v))}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleExecute}
                            disabled={executeMutation.isPending}
                            className={`${stats.invalid > 0 ? "bg-amber-600 hover:bg-amber-700" : "bg-primary"} shadow-md text-white`}
                        >
                            {executeMutation.isPending ? "Memproses..." : stats.invalid > 0 ? `Tetap Import (${stats.valid} Baris)` : "Konfirmasi & Import"}
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
