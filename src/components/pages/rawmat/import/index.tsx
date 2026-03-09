"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, FileText, Database, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

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

/* ================= TYPES ================= */

type ImportRawmatFormValues = {
    month: number;
    year: number;
};

const MAX_ROWS = 5000;

/* ================= COMPONENT ================= */

export function ImportRawmatForm() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [rows, setRows] = useState<RawmatImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        valid: 0,
        invalid: 0,
    });

    const [openDialog, setOpenDialog] = useState(false);

    // ===== Progress State =====
    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState("");

    const previewMutation = usePreviewImportRawmat();
    const getPreviewMutation = useGetPreviewImport();
    const executeMutation = useExecuteImportRawmat();

    /* ================= PROGRESS HELPER ================= */

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

    /* ================= PREVIEW ================= */

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

    /* ================= EXECUTE ================= */

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

            await executeMutation.mutateAsync({
                importId,
            });

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
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            size={"icon"}
                            variant={"ghost"}
                            type="button"
                            onClick={() => router.push("/rawmat")}
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <h1 className="text-xl"> Rawmat Import</h1>
                    </div>
                </CardTitle>
                <CardDescription>CSV / Excel (max {MAX_ROWS} rows)</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* File Upload */}
                <label className="border-dashed border-2 rounded-lg p-6 block text-center cursor-pointer">
                    <input
                        hidden
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <Upload className="mx-auto mb-2" />
                    {file ? file.name : "Choose file"}
                </label>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePreview}
                        disabled={!file || previewMutation.isPending}
                    >
                        {previewMutation.isPending ? (
                            <RefreshCw className="animate-spin" />
                        ) : (
                            <FileText />
                        )}
                        Preview
                    </Button>

                    <Button
                        onClick={() => setOpenDialog(true)}
                        disabled={!importId || stats.invalid > 0}
                    >
                        <Database />
                        Import
                    </Button>
                </div>

                {/* Invalid warning */}
                {stats.invalid > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>{stats.invalid} invalid rows detected</AlertDescription>
                    </Alert>
                )}

                {/* Preview */}
                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="errors">Errors ({stats.invalid})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview">
                        <PreviewTable rows={rows} />
                    </TabsContent>

                    <TabsContent value="errors">
                        <pre className="text-xs">
                            {JSON.stringify(
                                rows.filter((r) => r.errors.length),
                                null,
                                2,
                            )}
                        </pre>
                    </TabsContent>
                </Tabs>
            </CardContent>

            {/* ================= DIALOG ================= */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Import Raw Material</DialogTitle>
                    </DialogHeader>

                    {isImporting ? (
                        <p>Mohon tunggu dan jangan menutup aplikasi saat proses importing...</p>
                    ) : (
                        <p>Apakah anda sudah yakin dengan data tersebut?</p>
                    )}

                    {/* ===== Progress Bar ===== */}
                    {isImporting && (
                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{progressLabel}</span>
                                <span>{progress}%</span>
                            </div>

                            <div className="w-full h-2 bg-muted rounded overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                            disabled={isImporting}
                        >
                            Cancel
                        </Button>

                        <Button onClick={handleExecute} disabled={isImporting}>
                            {isImporting ? "Importing..." : "Konfirmasi Import"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
