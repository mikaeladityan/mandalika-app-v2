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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { PreviewTable } from "./preview";
import { RecipeImportPreviewDTO } from "@/app/(application)/recipes/import/server/import.schema";
import {
    useExecuteImportRecipe,
    useGetPreviewImport,
    usePreviewImportRecipe,
} from "@/app/(application)/recipes/import/server/use.import";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MAX_ROWS = 5000;

export function RecipeImportForm() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [rows, setRows] = useState<RecipeImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });

    const previewMutation = usePreviewImportRecipe();
    const getPreviewMutation = useGetPreviewImport();
    const executeMutation = useExecuteImportRecipe();

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
        if (!importId) return;

        await executeMutation.mutateAsync(importId);

        toast.success("Import completed", {
            description:
                stats.invalid > 0
                    ? `${stats.valid} rows imported, ${stats.invalid} invalid rows were skipped`
                    : `${stats.valid} rows imported successfully`,
        });

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
                            onClick={() => router.push("/recipes")}
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <h1 className="text-xl"> Import Resep</h1>
                    </div>
                </CardTitle>
                <CardDescription>CSV / Excel (max {MAX_ROWS} rows)</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* File */}
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

                {/* Controls */}
                <div className="flex justify-end gap-2">
                    <Link
                        target="_blank"
                        href={
                            "https://docs.google.com/spreadsheets/d/1SDet-Bl7q7RBjntKMfHtPXbvUG5D3vfmIRyU_u3bNI0/edit?usp=sharing"
                        }
                    >
                        <Button variant="warning">
                            <Container /> Template
                        </Button>
                    </Link>
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
                        onClick={handleImport}
                        disabled={!importId || stats.valid === 0 || executeMutation.isPending}
                    >
                        <Database />
                        Import
                    </Button>
                </div>

                {stats.invalid > 0 && (
                    <Alert
                        variant="default"
                        className="border-yellow-500 text-yellow-700 [&>svg]:text-yellow-500"
                    >
                        <AlertCircle />
                        <AlertDescription>
                            <strong>{stats.invalid} baris tidak valid</strong> dan akan dilewati
                            saat import. Hanya <strong>{stats.valid} baris valid</strong> yang akan
                            diproses.
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="errors">Errors ({stats.invalid})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview">
                        <PreviewTable rows={rows} />
                    </TabsContent>

                    <TabsContent value="errors">
                        {rows.filter((r) => r.errors.length).length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                No errors found.
                            </p>
                        ) : (
                            <PreviewTable rows={rows.filter((r) => r.errors.length)} />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
