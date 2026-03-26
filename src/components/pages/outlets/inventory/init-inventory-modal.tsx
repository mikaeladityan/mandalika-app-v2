"use client";

import { useState } from "react";
import { Search, Loader2, PackagePlus, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useProductsQuery } from "@/app/(application)/products/server/use.products";
import { useActionOutletInventory } from "@/app/(application)/outlets/inventory/server/use.outlet-inventory";
import { cn } from "@/lib/utils";

interface InitInventoryModalProps {
    outletId: number;
}

export function InitInventoryModal({ outletId }: InitInventoryModalProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const { data: products, isLoading } = useProductsQuery({
        search: search || undefined,
        status: "ACTIVE",
        sortBy: "name",
        sortOrder: "asc",
        take: 50,
    });

    const { init } = useActionOutletInventory(outletId);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map((p: any) => p.id));
        }
    };

    const handleInit = async () => {
        if (selectedIds.length === 0) return;
        
        await init.mutateAsync({ product_ids: selectedIds });
        setOpen(false);
        setSelectedIds([]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-xl shadow-md px-4">
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Daftarkan Produk
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <PackagePlus className="h-5 w-5 text-primary" />
                        Inisialisasi Produk ke Outlet
                    </DialogTitle>
                    <DialogDescription>
                        Pilih produk yang ingin ditambahkan ke stok outlet ini. Produk yang sudah ada akan dilewati.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-2 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-11 bg-muted/30 border-transparent rounded-xl focus-within:ring-1 focus-within:ring-primary/20 transition-all focus-visible:bg-white focus-visible:border-primary/20"
                        />
                    </div>

                    <div className="border rounded-2xl overflow-hidden flex-1 relative min-h-[300px]">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="w-12 px-4 py-3">
                                        <Checkbox
                                            checked={
                                                products?.length > 0 &&
                                                selectedIds.length === products.length
                                            }
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="font-bold">Informasi Produk</TableHead>
                                    <TableHead className="font-bold">Kode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="px-4 py-4">
                                                <div className="h-4 w-4 bg-slate-100 animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                                                    <div className="h-3 w-20 bg-slate-50 animate-pulse rounded" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <div className="h-4 w-16 bg-slate-100 animate-pulse rounded" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : products?.length > 0 ? (
                                    products.map((p: any) => (
                                        <TableRow
                                            key={p.id}
                                            className={cn(
                                                "cursor-pointer transition-colors border-slate-50/60",
                                                selectedIds.includes(p.id) && "bg-primary/5 hover:bg-primary/10"
                                            )}
                                            onClick={() => toggleSelect(p.id)}
                                        >
                                            <TableCell className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedIds.includes(p.id)}
                                                    onCheckedChange={() => toggleSelect(p.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">{p.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{p.type?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <Badge variant="outline" className="text-[10px] font-mono tracking-tight bg-slate-50">
                                                    {p.code}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">
                                            Tidak ada produk yang siap didaftarkan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50/80 border-t flex flex-row items-center justify-between sm:justify-between gap-4">
                    <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200">
                        <CheckCircle2 className={cn("size-3.5", selectedIds.length > 0 ? "text-primary" : "text-slate-300")} />
                        <span className="font-bold text-foreground tabular-nums">{selectedIds.length}</span> produk dipilih
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-slate-200 shadow-none hover:bg-white">
                            Batal
                        </Button>
                        <Button
                            onClick={handleInit}
                            disabled={selectedIds.length === 0 || init.isPending}
                            className="rounded-xl shadow-md min-w-[120px]"
                        >
                            {init.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <PackagePlus className="mr-2 h-4 w-4" />
                            )}
                            Daftarkan
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
