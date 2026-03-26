"use client";

import { useState } from "react";
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

import { PreviewTable } from "./preview";
import {
    useExecuteImportRawmat,
    useGetPreviewImport,
    usePreviewImportRawmat,
} from "@/app/(application)/rawmat/import/server/use.import";
import { RawmatImportPreviewDTO } from "@/app/(application)/rawmat/import/server/import.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResultDialog } from "./result.dialog";

const MAX_ROWS = 5000;

export function ImportRawmatForm() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [rows, setRows] = useState<RawmatImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });
    const [importResult, setImportResult] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState("");

    const previewMutation = usePreviewImportRawmat();
    const getPreviewMutation = useGetPreviewImport();
    const executeMutation = useExecuteImportRawmat();

    function runProgress(from: number, to: number, duration: number, label: string) {
        return new Promise<void>((resolve) => {
            setProgressLabel(label);
            const start = Date.now();
            const tick = () => {
                const elapsed = Date.now() - start;
                const ratio = Math.min(elapsed / duration, 1);
                const value = Math.round(from + ratio * (to - from));
                setProgress(value);
                if (ratio < 1) {
                    requestAnimationFrame(tick);
                } else {
                    resolve();
                }
            };
            tick();
        });
    }

    async function handlePreview() {
        if (!file) return;
        try {
            const preview = await previewMutation.mutateAsync(file);
            setImportId(preview.import_id);
            setStats({
                total: preview.total,
                valid: preview.valid,
                invalid: preview.invalid,
            });
            const detail = await getPreviewMutation.mutateAsync(preview.import_id);
            setRows(detail.rows);
            toast.success("Preview generated");
        } catch {
            toast.error("Failed to generate preview");
        }
    }

    async function handleExecute() {
        if (!importId || stats.invalid > 0) return;
        try {
            setIsImporting(true);
            setProgress(0);
            await runProgress(0, 10, 400, "Initializing import...");
            await runProgress(10, 30, 800, "Validating data...");
            await runProgress(30, 60, 1500, "Preparing master data...");
            await runProgress(60, 90, 2000, "Importing raw materials...");
            await runProgress(90, 95, 500, "Finalizing...");

            const result = await executeMutation.mutateAsync({ importId });
            setImportResult(result);

            setProgress(100);
            setProgressLabel("Import completed");
            toast.success("Import completed");

            setTimeout(() => {
                setOpenDialog(false);
                setImportId(null);
                setRows([]);
                setStats({ total: 0, valid: 0, invalid: 0 });
                setFile(null);
                setProgress(0);
                setProgressLabel("");
            }, 500);
        } catch {
            toast.error("Import failed");
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <div className="space-y-6 w-full pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        onClick={() => router.push("/rawmat")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        target="_blank"
                        href="https://docs.google.com/spreadsheets/d/1jT9fGCKUDOyNimdLrQ66Y1OKg6d9AUxdJCHQOUyDPZI/edit?usp=sharing"
                    >
                        <Button
                            size={"sm"}
                            variant="outline"
                            className="shadow-sm border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                        >
                            <Container className="mr-2 h-4 w-4" /> Download Template
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Import Material (Rawmat)
                </h1>
                <p className="text-sm text-muted-foreground">
                    Tambah data material atau bahan baku secara massal melalui file Excel/CSV.
                </p>
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
                                size="sm"
                                className="px-4 shadow-sm"
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
                                size="sm"
                                className="px-4 shadow-md"
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
                            <Database className="h-5 w-5 text-primary" />
                            Konfirmasi Import Material
                        </DialogTitle>
                    </DialogHeader>

                    {isImporting ? (
                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    <span>{progressLabel}</span>
                                    <span className="text-primary">{progress}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50 p-0.5">
                                    <div
                                        className="bg-linear-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                            </div>
                            <p className="text-sm text-center text-slate-500 animate-pulse">
                                Mohon tunggu, sistem sedang memproses data material...
                            </p>
                        </div>
                    ) : (
                        <div className="py-4">
                            <p className="text-slate-600">
                                Apakah Anda yakin ingin memproses{" "}
                                <strong>{stats.valid} baris</strong> data material ke dalam sistem?
                            </p>
                            <p className="text-xs text-slate-400 mt-2 italic">
                                *Tindakan ini akan mengupdate data yang sudah ada atau membuat data
                                baru.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpenDialog(false)}
                            disabled={isImporting}
                        >
                            Batal
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleExecute}
                            disabled={isImporting}
                            className="bg-primary shadow-md"
                        >
                            {isImporting ? "Memproses..." : "Ya, Lanjutkan Import"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ResultDialog
                result={importResult}
                dryRun={false}
                open={!!importResult}
                onOpenChange={() => setImportResult(null)}
            />
        </div>
    );
}
