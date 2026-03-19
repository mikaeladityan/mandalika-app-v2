"use client";

import { Box, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { StockTransferTable } from "@/components/pages/stock-transfers/stock-transfer-table";
import { useStockTransferTableState } from "@/app/(application)/stock-transfers/server/use.stock-transfer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectFilter } from "@/components/ui/form/select";
import { TRANSFER_STATUS } from "@/shared/types";

export default function StockTransfersPage() {
    const table = useStockTransferTableState();

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Box className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Stock Transfer
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">
                            Kelola mutasi stok antar gudang dan outlet.
                        </p>
                    </div>
                </div>
                <Link href="/stock-transfers/create">
                    <Button className="rounded-xl shadow-md hover:shadow-lg transition-all px-6">
                        <Plus size={16} className="mr-2" />
                        Buat Transfer
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Cari No. Transfer atau Barcode..."
                        value={table.search}
                        onChange={(e) => table.setSearch(e.target.value)}
                        className="pl-10 h-10 bg-muted/30 border-transparent rounded-xl focus-within:ring-1 focus-within:ring-primary/20 transition-all focus-visible:bg-white focus-visible:border-primary/20"
                    />
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                    <SelectFilter
                        placeholder="Semua Status"
                        value={table.status ?? null}
                        options={TRANSFER_STATUS.map((s) => ({
                            value: s,
                            label: s.charAt(0) + s.slice(1).toLowerCase(),
                        }))}
                        onChange={(val) => table.setStatus(val as any)}
                        onReset={() => table.setStatus(undefined)}
                        className="min-w-40 bg-white"
                    />

                    {(table.status || table.search) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                table.setSearch("");
                                table.setStatus(undefined);
                            }}
                            className="h-9 px-3 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                            Reset <X className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            <StockTransferTable />
        </section>
    );
}
