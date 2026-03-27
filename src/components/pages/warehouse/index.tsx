"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Settings2, WarehouseIcon, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    useFormWarehouse,
    useWarehouseStatic,
    useWarehouseTableState,
} from "@/app/(application)/warehouses/server/use.warehouse";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ResponseWarehouseDTO } from "@/app/(application)/warehouses/server/warehouse.schema";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateWarehouseDialog, EditWarehouseDialog } from "./warehouse-form-dialog";

export function Warehouse() {
    const table = useWarehouseTableState();
    const { data: warehouses = [], isLoading } = useWarehouseStatic(table.queryParams);
    
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const handleEdit = (id: number) => {
        setEditId(id);
        setOpenEdit(true);
    };

    return (
        <section className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">Gudang Perusahaan</h1>
                <Button 
                    size="sm" 
                    onClick={() => setOpenCreate(true)}
                    className="rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                    <Plus size={16} className="mr-2" />
                    Tambah Gudang
                </Button>
            </header>

            <CreateWarehouseDialog open={openCreate} setOpen={setOpenCreate} />
            <EditWarehouseDialog open={openEdit} setOpen={setOpenEdit} id={editId} />

            {/* CARD GUDANG */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="shadow-sm">
                            <CardHeader className="flex flex-row justify-between p-4 pb-2">
                                <Skeleton className="h-5 w-32" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex justify-center py-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                            </CardContent>
                            <CardFooter className="p-2 border-t flex gap-2">
                                <Skeleton className="h-8 w-full" />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <>
                        {warehouses.map((w) => (
                            <Card
                                key={w.id}
                                className="hover:border-primary transition-all shadow-sm group relative"
                            >
                                <CardHeader className="flex flex-row justify-between p-4 pb-2">
                                    <span className="font-bold">{w.name}</span>
                                    <div className="flex items-center justify-end gap-2">
                                        <DeletedWarehouse data={w} />
                                        <Button
                                            variant={"outline"}
                                            size={"icon"}
                                            className="h-8 w-8"
                                            onClick={() => handleEdit(w.id)}
                                        >
                                            <Settings2
                                                size={14}
                                                className="text-muted-foreground"
                                            />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex justify-center py-4">
                                    <WarehouseIcon size={60} className="text-slate-200 group-hover:text-primary/20 transition-colors" />
                                </CardContent>
                                <CardFooter className="p-2 border-t flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-xs"
                                        asChild
                                    >
                                        <Link href={`/warehouses/${w.id}`}>Detail</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                        <button
                            onClick={() => setOpenCreate(true)}
                            className="border-2 border-dashed rounded-xl flex items-center justify-center hover:bg-slate-50 min-h-45 transition-colors group"
                        >
                            <Plus size={30} className="text-slate-400 group-hover:text-primary transition-colors" />
                        </button>
                    </>
                )}
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
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 text-rose-500">
                    {deleted.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Trash2 size={14} />
                    )}
                </Button>
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
                        placeholder="Tulis kembali nama Gudang"
                        disabled={deleted.isPending}
                    />
                    {err && <small className="text-rose-500">{err}</small>}
                </div>
                <DialogFooter>
                    <Button
                        variant={"teal"}
                        type="button"
                        size={"sm"}
                        onClick={onConfirm}
                        disabled={deleted.isPending}
                    >
                        {deleted.isPending ? <Loader2 className="animate-spin" /> : " Yakin"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
