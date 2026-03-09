"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TemplateContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
};

const MAX_ROWS = 5000;

export function ImportSalesForm() {
    const router = useRouter();
    const now = new Date();

    // Form for month and year selection
    const form = useForm<ImportSalesFormValues>({
        defaultValues: {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
        },
    });

    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [rows, setRows] = useState<SalesImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });
    const [openDialog, setOpenDialog] = useState(false);

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

        toast.success("Preview generated");
    }

    async function handleExecute() {
        if (!importId || stats.invalid > 0) return;

        const { month, year } = form.getValues();

        await executeMutation.mutateAsync({
            importId,
            month,
            year,
        });

        toast.success("Import completed");

        // Reset state after successful import
        setOpenDialog(false);
        setImportId(null);
        setRows([]);
        setStats({ total: 0, valid: 0, invalid: 0 });
        setFile(null);
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
                            onClick={() => router.push("/sales")}
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <h1 className="text-xl"> Sales Import</h1>
                    </div>
                </CardTitle>
                <CardDescription>CSV / Excel (max {MAX_ROWS} rows)</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* File upload */}
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

                {/* Action buttons */}
                <div className="flex flex-col items-end space-y-3">
                    <Button asChild className="font-semibold" variant={"warning"}>
                        <Link
                            href={
                                "https://docs.google.com/spreadsheets/d/1DoTlWLwf2k1rU_9vCvG2znZ01Teu7PWOzfOmD08DFLk/edit?usp=sharing"
                            }
                            target="_blank"
                        >
                            <Container />
                            Template
                        </Link>
                    </Button>
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
                </div>

                {/* Invalid rows warning */}
                {stats.invalid > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>{stats.invalid} invalid rows detected</AlertDescription>
                    </Alert>
                )}

                {/* Preview & errors tabs */}
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

            {/* Import period confirmation dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Import Period</DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-4">
                        <SelectForm
                            name="month"
                            label="Month"
                            required
                            control={form.control}
                            options={MONTH_OPTIONS}
                            onValueChange={(v) => form.setValue("month", Number(v))}
                        />

                        <SelectForm
                            name="year"
                            label="Year"
                            required
                            control={form.control}
                            options={YEAR_OPTIONS}
                            onValueChange={(v) => form.setValue("year", Number(v))}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>

                        <Button onClick={handleExecute} disabled={executeMutation.isPending}>
                            Confirm Import
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
