"use client";

import { useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { PreviewTable } from "./preview";
import { RecipeImportPreviewDTO } from "@/app/(application)/recipes/import/server/import.schema";
import {
    useExecuteImportRecipe,
    useGetPreviewImport,
    usePreviewImportRecipe,
} from "@/app/(application)/recipes/import/server/use.import";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResultDialog } from "./result.dialog";

const MAX_ROWS = 5000;

export function RecipeImportForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [rows, setRows] = useState<RecipeImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });
    const [importResult, setImportResult] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);

    const previewMutation = usePreviewImportRecipe();
    const getPreviewMutation = useGetPreviewImport();
    const executeMutation = useExecuteImportRecipe();
    const [openDialog, setOpenDialog] = useState(false);

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

    async function handleImport() {
        if (!importId || stats.valid === 0) return;

        const result = await executeMutation.mutateAsync(importId);
        setImportResult(result);

        toast.success("Import completed");

        setOpenDialog(false);
        setImportId(null);
        setRows([]);
        setStats({ total: 0, valid: 0, invalid: 0 });
        setFile(null);
    }

    return (
        <div className="space-y-6 w-full pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                <div className="flex items-center gap-4">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-9 w-9 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                        onClick={() => router.push("/recipes")}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
                            Import Resep Produk
                        </h1>
                        <p className="text-[13px] text-slate-500 font-medium">
                            Upload file CSV atau Excel untuk menambahkan data resep secara massal.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        target="_blank"
                        href="https://docs.google.com/spreadsheets/d/1SDet-Bl7q7RBjntKMfHtPXbvUG5D3vfmIRyU_u3bNI0/edit?usp=sharing"
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-9 font-bold shadow-sm border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                        >
                            <Container className="mr-2 h-4 w-4" /> Template
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card className="border border-slate-200 rounded-[18px] shadow-[0_10px_20px_rgba(15,23,42,0.06)] overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/30 border-b border-slate-100 p-6">
                        <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2.5">
                            <div className="h-5 w-1 bg-primary rounded-full" />
                            File Upload
                        </CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                            CSV atau XLSX • Maksimal {MAX_ROWS} baris
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* File Dropzone */}
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
                                    setFile(droppedFile);
                                }
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                aria-hidden="true"
                                hidden
                                type="file"
                                accept=".csv,.xlsx"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                            <div className={`flex flex-col items-center ${isDragging ? "pointer-events-none" : ""}`}>
                                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                                    <Upload className="h-6 w-6 text-slate-500 group-hover:text-primary" />
                                </div>
                                {file ? (
                                    <div className="space-y-2">
                                        <span className="text-lg font-bold text-primary block">
                                            {file.name}
                                        </span>
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </Badge>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-lg font-medium text-slate-700 block mb-1">
                                            Klik atau seret file ke sini
                                        </span>
                                        <span className="text-sm text-slate-400 text-center">
                                            Pilih file Excel/CSV untuk mulai
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3.5 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 px-6 font-black uppercase tracking-widest text-[11px] shadow-sm bg-white hover:bg-slate-50 border-slate-200"
                                onClick={handlePreview}
                                disabled={!file || previewMutation.isPending}
                            >
                                {previewMutation.isPending ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <FileText className="mr-2 h-4 w-4 text-slate-400" />
                                )}
                                Preview Data
                            </Button>

                            <Button
                                size="sm"
                                className={`h-11 px-10 font-bold shadow-xl transition-all hover:scale-105 active:scale-95 ${stats.invalid > 0 ? "bg-amber-600 hover:bg-amber-700" : "bg-primary"}`}
                                onClick={() => setOpenDialog(true)}
                                disabled={
                                    !importId || stats.valid === 0 || executeMutation.isPending
                                }
                            >
                                {executeMutation.isPending ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Database className="mr-2 h-4 w-4" />
                                )}
                                Jalankan Import
                            </Button>
                        </div>

                        {stats.invalid > 0 && (
                            <Alert
                                variant="default"
                                className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl shadow-sm [&>svg]:text-amber-500 py-4"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-xs font-bold uppercase tracking-tight">
                                    Terdapat <strong>{stats.invalid} baris tidak valid</strong>.
                                    Hanya <strong>{stats.valid} baris valid</strong> yang akan
                                    diproses.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {importId && (
                    <Card className="border border-slate-200 rounded-[18px] shadow-[0_10px_20px_rgba(15,23,42,0.06)] overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="bg-slate-50/30 border-b border-slate-100 p-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2.5">
                                    <div className="h-5 w-1 bg-primary rounded-full" />
                                    Pratinjau Data
                                </CardTitle>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider shadow-sm">
                                        {stats.valid} Valid
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-wider shadow-sm">
                                        {stats.invalid} Invalid
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs defaultValue="preview" className="w-full">
                                <div className="px-6 pt-6 mb-6">
                                    <TabsList className="bg-slate-100/50 p-1.5 h-auto rounded-xl border border-slate-100">
                                        <TabsTrigger
                                            value="preview"
                                            className="px-8 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
                                        >
                                            Preview ({stats.valid})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="errors"
                                            className="px-8 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all text-slate-400 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-rose-500"
                                        >
                                            Invalid Data ({stats.invalid})
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="preview" className="mt-0">
                                    <div className="border-t border-slate-100">
                                        <PreviewTable rows={rows} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="errors" className="mt-0">
                                    <div className="border-t border-slate-100">
                                        {rows.filter((r) => r.errors.length).length === 0 ? (
                                            <div className="py-20 text-center bg-white">
                                                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
                                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                                                    Tidak ada data error.
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
                            <Database className="h-5 w-5 text-primary" />
                            Konfirmasi Import Resep
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
                            Anda akan melakukan bulk update/insert sebanyak <strong>{stats.valid} resep</strong>. 
                            Pastikan data sudah sesuai sebelum melanjutkan.
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleImport}
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
            />
        </div>
    );
}
