"use client";

import { History, Search, X, Layers, Warehouse as WarehouseIcon, Store } from "lucide-react";
import { StockMovementTable } from "@/components/pages/stock-movements/stock-movement-table";
import { useStockMovementTableState } from "@/app/(application)/stock-movements/server/use.stock-movement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectFilter } from "@/components/ui/form/select";
import { MOVEMENT_TYPE, MOVEMENT_LOCATION_TYPE } from "@/shared/types";
import { cn } from "@/lib/utils";

export default function StockMovementsPage() {
    const table = useStockMovementTableState();

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <History className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Riwayat Pergerakan Stok
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">
                            Pantau semua log aktivitas stok (In, Out, Transfer, Adj) secara real-time.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full lg:max-w-md group shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Cari ID produk atau referensi..."
                        value={table.search}
                        onChange={(e) => table.setSearch(e.target.value)}
                        className="pl-10 h-10 bg-muted/30 border-transparent rounded-xl focus-within:ring-1 focus-within:ring-primary/20 transition-all focus-visible:bg-white focus-visible:border-primary/20"
                    />
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                    <SelectFilter
                        placeholder="Tipe Log"
                        value={table.movementType ?? null}
                        options={MOVEMENT_TYPE.map((s) => ({
                            value: s,
                            label: s.replace("_", " "),
                        }))}
                        onChange={(val) => table.setFilter("movement_type", val)}
                        onReset={() => table.setFilter("movement_type", undefined)}
                        className="min-w-40 bg-white"
                    />

                    <SelectFilter
                        placeholder="Tipe Lokasi"
                        value={table.locationType ?? null}
                        options={MOVEMENT_LOCATION_TYPE.map((s) => ({
                            value: s,
                            label: s.charAt(0) + s.slice(1).toLowerCase(),
                        }))}
                        onChange={(val) => table.setFilter("location_type", val)}
                        onReset={() => table.setFilter("location_type", undefined)}
                        className="min-w-40 bg-white"
                    />

                    {(table.movementType || table.locationType || table.search) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                table.setSearch("");
                                table.setFilter("movement_type", undefined);
                                table.setFilter("location_type", undefined);
                            }}
                            className="h-9 px-3 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                            Reset <X className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            <StockMovementTable />
        </section>
    );
}
