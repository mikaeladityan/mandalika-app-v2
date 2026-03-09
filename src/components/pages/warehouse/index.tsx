"use client";

import { useMemo, useState } from "react"; // Tambahkan useState
import Link from "next/link";
import { Plus, Settings2, WarehouseIcon, Search, Loader2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tambahkan ini
import {
    useFormWarehouse,
    useWarehouseQuery,
    useWarehouseStatic,
    useWarehouseTableState,
} from "@/app/(application)/warehouses/server/use.warehouse";
import { WarehouseInventoryColumns } from "./table/column";
import { DataTable } from "@/components/ui/table/data";
import { ColumnDef } from "@tanstack/react-table";
import { transformToStockTable } from "@/lib/utils/inventory";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    RequestReconcileDTO,
    RequestReconcileSchema,
} from "@/app/(application)/forecasts/server/forecast.schema";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFormForecast } from "@/app/(application)/forecasts/server/use.forecast";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
    QueryProductInventoryDTO,
    ResponseWarehouseDTO,
} from "@/app/(application)/warehouses/server/warehouse.schema";
import { Input } from "@/components/ui/input";

type StockTableRow = ReturnType<typeof transformToStockTable>[0];

export function Warehouse() {
    const table = useWarehouseTableState();
    const type = table.queryParams.type;

    const { data: warehouses = [] } = useWarehouseStatic(table.queryParams);
    const { list: inventoryRaw = [], isFetching, isLoading } = useWarehouseQuery(table.queryParams);

    // Kirim 'category' ke fungsi transformasi
    const stockData = useMemo(
        () => transformToStockTable(inventoryRaw, type),
        [inventoryRaw, type],
    );

    const warehouseNames = useMemo(() => warehouses.map((w) => w.name), [warehouses]);

    const columns = useMemo(
        () =>
            WarehouseInventoryColumns(warehouseNames, type) as ColumnDef<StockTableRow, unknown>[],
        [warehouseNames],
    );

    // Hitung total data berdasarkan kategori yang aktif
    const totalCount = useMemo(() => {
        if (inventoryRaw.length === 0) return 0;
        const key = type === "FINISH_GOODS" ? "product_inventories" : "raw_material_inventories";
        return inventoryRaw[0][key]?.length ?? 0;
    }, [inventoryRaw, type]);

    return (
        <section className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">Gudang Perusahaan</h1>
                {/* <div className="flex gap-2">
                    <Link href={"/warehouses/products/import"}>
                        <Button variant="success" size="sm">
                            <Download size={16} className="mr-2" /> Export Produk
                        </Button>
                    </Link>
                    <Link href={"/warehouses/rawmaterials"}>
                        <Button variant="success" size="sm">
                            <Download size={16} className="mr-2" /> Export Raw Mat
                        </Button>
                    </Link>
                </div> */}
            </header>

            {/* CARD GUDANG */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {warehouses.map((w) => (
                    <Card key={w.id} className="hover:border-primary transition-all shadow-sm">
                        <CardHeader className="flex flex-row justify-between p-4 pb-2">
                            <span className="font-bold">{w.name}</span>
                            <div className="flex items-center justify-end gap-2">
                                <DeletedWarehouse data={w} />
                                <Link href={`/warehouses/${w.id}/edit`}>
                                    <Button variant={"outline"} size={"icon"} className="h-8 w-8">
                                        <Settings2 size={14} className="text-muted-foreground" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center py-4">
                            <WarehouseIcon size={60} className="text-slate-200" />
                        </CardContent>
                        <CardFooter className="p-2 border-t flex gap-2">
                            <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                                <Link href={`/warehouses/${w.id}`}>Detail</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                <Link
                    href="/warehouses/create"
                    className="border-2 border-dashed rounded-xl flex items-center justify-center hover:bg-slate-50 min-h-45"
                >
                    <Plus size={30} className="text-slate-400" />
                </Link>
            </div>
        </section>
    );
}

export function DeletedWarehouse({ data }: { data: ResponseWarehouseDTO }) {
    const { deleted } = useFormWarehouse(data.id);
    const [confirm, setConfirm] = useState<string>("");
    const [err, setErr] = useState<string>("");

    const onConfirm = async () => {
        setErr("");

        if (!confirm) {
            setErr("Konfirmasi tidak boleh kosong");
            return;
        }

        if (confirm !== data.name) {
            setErr("Konfirmasi tidak valid");
            return;
        }

        await deleted.mutateAsync();
    };

    return (
        <Dialog>
            <DialogTrigger className="text-rose-500 cursor-pointer border border-gray-200 rounded-md shadow bg-white p-2 flex items-center justify-center">
                {deleted.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={14} />}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">Hapus Gudang</DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk menghapus gudang{" "}
                        <span className="px-1 rounded bg-gray-100 font-medium">{data.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <label htmlFor="confirm" className="text-sm font-medium text-gray-700">
                        Konfirmasi
                    </label>
                    <Input
                        name="confirm"
                        onChange={(e) => setConfirm(e.target.value)}
                        value={confirm}
                        placeholder="Tulis kembali nama Produk"
                        disabled={deleted.isPending}
                    />
                    {err && <small className="text-rose-500">{err}</small>}
                </div>
                <DialogFooter>
                    <Button variant={"teal"} type="button" size={"sm"} onClick={onConfirm}>
                        {deleted.isPending ? <Loader2 className="animate-spin" /> : " Yakin"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
