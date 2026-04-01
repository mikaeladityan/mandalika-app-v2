"use client";

import { useMemo } from "react";
import { AlertTriangle, Search, Loader2, RefreshCcw, FileSpreadsheet } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DataTable } from "@/components/ui/table/data";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { Button } from "@/components/ui/button";
import {
    useDiscrepancy,
    useDiscrepancyTableState,
    useExportDiscrepancy,
} from "@/app/(application)/inventory-v2/discrepancy/server/use.discrepancy";
import { DiscrepancyColumns } from "./table/columns";

export function DiscrepancyReport() {
    const table = useDiscrepancyTableState();
    const { data, meta, isLoading, isFetching, refetch } = useDiscrepancy(table.queryParams);
    const { exportData, isExporting } = useExportDiscrepancy();

    const columns = useMemo(() => DiscrepancyColumns, []);

    return (
        <div className="flex flex-col gap-5">
            <Card className="border-none shadow-sm bg-linear-to-b from-white to-zinc-50/50">
                <CardHeader className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-rose-100 p-2.5 rounded-xl border border-rose-200">
                                <AlertTriangle className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900 uppercase">
                                    Laporan Selisih (Discrepancy)
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Audit barang hilang atau ditolak pada DO & Transfer Gudang.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="h-9 px-4 font-bold border-zinc-200"
                            >
                                <RefreshCcw
                                    className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                                />
                                REFRESH
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportData(table.queryParams)}
                                disabled={isExporting}
                                className="h-9 px-4 border-zinc-200 text-zinc-700 font-bold uppercase text-[11px] tracking-wider"
                            >
                                {isExporting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-600" />
                                ) : (
                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                                )}
                                EXPORT AUDIT
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-2">
                        <InputGroup className="w-full md:max-w-md border-zinc-300">
                            <InputGroupInput
                                placeholder="Cari No. Transfer atau Nama Produk..."
                                value={table.search}
                                onChange={(e) => table.setSearch(e.target.value)}
                            />
                            <InputGroupAddon align="inline-end">
                                {isFetching ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4 text-zinc-400" />
                                )}
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </CardHeader>

                {isLoading && !data.length ? (
                    <CardContent>
                        <TableSkeleton />
                    </CardContent>
                ) : (
                    <CardContent>
                        <DataTable
                            tableId="discrepancy-audit-table"
                            columns={columns}
                            data={data}
                            page={table.queryParams.page || 1}
                            pageSize={table.queryParams.take || 25}
                            total={meta?.len ?? 0}
                            onPageChange={(page) => table.setPage(page)}
                            onPageSizeChange={(size) => table.setPageSize(size)}
                            enableMultiSelect={false}
                        />
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
