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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWarehouses } from "@/app/(application)/shared/use.shared";
import { useParams, useRouter } from "next/navigation";

import { PreviewTable } from "./preview";
import { RawMaterialInventoryImportPreviewDTO } from "@/app/(application)/rawmat/stocks/[id]/import/server/import.schema";
import {
    useExecuteImportRawMaterialInventory,
    useGetPreviewImportRawMaterialInventory,
    usePreviewImportRawMaterialInventory,
} from "@/app/(application)/rawmat/stocks/[id]/import/server/use.import";
import Link from "next/link";

const MAX_ROWS = 5000;

export function RawMaterialInventoryImportForm() {
    const { id } = useParams();
    const router = useRouter();
    const warehouse = useWarehouses();

    const [file, setFile] = useState<File | null>(null);
    const [importId, setImportId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [rows, setRows] = useState<RawMaterialInventoryImportPreviewDTO[]>([]);
    const [stats, setStats] = useState({ total: 0, valid: 0, invalid: 0 });

    const previewMutation = usePreviewImportRawMaterialInventory();
    const getPreviewMutation = useGetPreviewImportRawMaterialInventory();
    const executeMutation = useExecuteImportRawMaterialInventory();

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
        if (!importId || stats.valid === 0 || !selectedDate) {
            if (!selectedDate) toast.error("Pilih tanggal terlebih dahulu");
            if (stats.valid === 0) toast.error("Tidak ada data valid untuk diimport");
            return;
        }

        const date = selectedDate.getDate();
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

        await executeMutation.mutateAsync({
            importId,
            warehouseId: Number(id),
            date: Number(date),
            month: Number(month),
            year: Number(year),
        });

        toast.success("Import completed");

        setImportId(null);
        setRows([]);
        setStats({ total: 0, valid: 0, invalid: 0 });
        setFile(null);
        setSelectedDate(undefined);
        setIsDialogOpen(false);
    }

    const selectWarehouse = warehouse.data?.filter((w) => w.id === Number(id));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="capitalize">
                    <div className="flex items-center gap-2">
                        <Button
                            size={"icon"}
                            variant={"ghost"}
                            type="button"
                            onClick={() => router.push(`/rawmat/stocks/${id}`)}
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <h1 className="text-xl">
                            {" "}
                            RawMaterial Import {selectWarehouse?.[0]?.name?.toLowerCase() ?? "..."}
                        </h1>
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
                    <Button asChild variant="warning">
                        <Link
                            href={
                                "https://docs.google.com/spreadsheets/d/14NuSAz7_yvtQC5CRs1rjgosyC6bXSfreZceiDmKZ4Rc/edit?usp=sharing"
                            }
                            target="_blank"
                        >
                            <Container />
                            Export
                        </Link>
                    </Button>
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

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                disabled={
                                    !importId || stats.valid === 0 || executeMutation.isPending
                                }
                            >
                                <Database />
                                Import
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Konfirmasi Import Stok Raw Material</DialogTitle>
                                <DialogDescription>
                                    Silakan pilih tanggal periode stok yang akan disesuaikan
                                    (Upsert).
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col space-y-2 py-4">
                                <label className="text-sm font-semibold">
                                    Periode (Tanggal Stok)
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !selectedDate && "text-muted-foreground",
                                            )}
                                        >
                                            {selectedDate ? (
                                                format(selectedDate, "PPP")
                                            ) : (
                                                <span>Pilih tanggal</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={!selectedDate || executeMutation.isPending}
                                >
                                    {executeMutation.isPending ? (
                                        <RefreshCw className="animate-spin mr-2" />
                                    ) : null}
                                    Eksekusi Import
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {stats.invalid > 0 && (
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                        <AlertCircle className="size-4 text-amber-600" />
                        <AlertDescription>
                            Ditemukan {stats.invalid} baris tidak valid. Baris ini akan otomatis
                            dilewati (skipped) saat eksekusi.
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
