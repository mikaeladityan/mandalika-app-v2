"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, Database, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

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
        if (!importId || stats.invalid > 0) return;

        await executeMutation.mutateAsync(importId);

        toast.success("Import completed");

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
                        disabled={!importId || stats.invalid > 0 || executeMutation.isPending}
                    >
                        <Database />
                        Import
                    </Button>
                </div>

                {stats.invalid > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription>{stats.invalid} invalid rows detected</AlertDescription>
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
        </Card>
    );
}
