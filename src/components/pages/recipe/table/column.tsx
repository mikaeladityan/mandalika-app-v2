"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { SortableHeader } from "@/components/ui/table/sortable";
import { QueryRecipeDTO } from "@/app/(application)/recipes/server/recipe.schema";
import { Beaker } from "lucide-react";

export interface GroupedRecipe {
    id: number;
    code: string;
    name: string;
    size: {
        id: number;
        size: number;
    } | null;
    product_type: {
        id: number;
        name: string;
    } | null;
    unit: {
        id: number;
        name: string;
    } | null;
    version: number;
    is_active: boolean;
    description: string | null;
    total_material?: number;
    materials: Array<{
        id: number;
        name: string;
        barcode: string | null;
        quantity: number;
        unit: string;
        stock: number;
        price: number;
    }>;
}

type Props = {
    sortBy?: QueryRecipeDTO["sortBy"];
    sortOrder?: QueryRecipeDTO["sortOrder"];
    onSort: (key: string) => void;
};

export const RecipeColumns = ({ sortBy, sortOrder, onSort }: Props): ColumnDef<GroupedRecipe>[] => [
    {
        id: "product_info",
        header: () => (
            <SortableHeader
                label="PRODUK (FINISHED GOOD)"
                sortKey="product"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col gap-1.5 min-w-56 py-3 px-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={`/recipes/form/${row.original.id}`}
                        className="hover:underline decoration-primary"
                    >
                        <span className="font-bold text-slate-950 text-[13px] leading-tight">
                            {row.original.name}
                        </span>
                    </Link>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md border border-amber-200/50">
                            v{row.original.version}
                        </span>
                        {row.original.is_active && (
                            <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-md uppercase tracking-tighter shadow-sm">
                                Active
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 w-fit px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-tight">
                        {row.original.code}
                    </span>
                    <span className="text-[10px] font-bold bg-zinc-900 text-zinc-100 w-fit px-2 py-0.5 rounded border border-zinc-700 uppercase tracking-tight">
                        {row.original.size?.size} {row.original.unit?.name}
                    </span>
                </div>
                {row.original.description && (
                    <p className="text-[11px] text-slate-400 font-medium italic mt-0.5 line-clamp-1 border-l-2 border-slate-100 pl-2">
                        {row.original.description}
                    </p>
                )}
                <div className="mt-1">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider border border-slate-200/50">
                        {row.original.product_type?.name}
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: "material_details",
        header: () => (
            <div className="grid grid-cols-12 w-full gap-2 px-4 py-2 border-l border-slate-100">
                <div className="col-span-8 text-left uppercase text-[9px] font-black text-slate-500 tracking-wider">
                    BAHAN BAKU / MATERIAL
                </div>
                <div className="col-span-2 text-right uppercase text-[9px] font-black text-slate-500 tracking-wider">
                    QTY
                </div>
                <div className="col-span-2 text-right uppercase text-[9px] font-black text-slate-500 tracking-wider">
                    STOK
                </div>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-150 border-l border-slate-50">
                {row.original.materials.map((mat, idx) => (
                    <div
                        key={idx}
                        className={`grid grid-cols-12 w-full items-center py-2.5 px-4 ${
                            idx !== row.original.materials.length - 1
                                ? "border-b border-slate-50"
                                : ""
                        } hover:bg-slate-50/50 transition-colors group`}
                    >
                        {/* Nama Material */}
                        <div className="col-span-8 flex flex-col pr-4">
                            <span className="text-[11px] font-bold text-slate-800 group-hover:text-primary transition-colors">
                                {mat.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
                                {mat.barcode || "-"}
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 text-right">
                            <span className="text-[11px] font-black text-slate-950">
                                {Number(mat.quantity).toLocaleString()}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 ml-1 uppercase">
                                {mat.unit}
                            </span>
                        </div>

                        {/* Stock */}
                        <div className="col-span-2 text-right">
                            <span
                                className={`text-[11px] font-bold ${
                                    Number(mat.stock) < Number(mat.quantity)
                                        ? "text-rose-500"
                                        : "text-slate-500"
                                }`}
                            >
                                {Math.round(Number(mat.stock)).toLocaleString()}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 ml-1 uppercase">
                                {mat.unit}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "total_material",
        header: () => (
            <SortableHeader
                label="TOTAL"
                sortKey="totalMaterial"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500 min-w-24">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200/50 shadow-xs">
                    <Beaker className="h-3 w-3" />
                    <span className="text-[12px] font-black leading-none tabular-nums">
                        {row.original.total_material || 0}
                    </span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Material
                </span>
            </div>
        ),
    },
];
// function DialogDelete({ data }: { data: ResponseProductDTO }) {
//     const [confirm, setConfirm] = useState<string>("");
//     const [err, setErr] = useState<string>("");
//     const { deleted } = useActionProduct();
//     const onConfirm = async (code: string) => {
//         setErr("");

//         if (!confirm) {
//             setErr("Konfirmasi tidak boleh kosong");
//             return;
//         }

//         if (confirm !== data.name) {
//             setErr("Konfirmasi tidak valid");
//             return;
//         }

//         await deleted.mutateAsync({ code });
//     };

//     return (
//         <Dialog>
//             <DialogTrigger className="text-rose-500 cursor-pointer">
//                 {deleted.isPending ? <Loader2 className="animate-spin" /> : <Trash2 size={16} />}
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle className="font-semibold text-lg">
//                         Hapus Produk (Finish Good)
//                     </DialogTitle>
//                     <DialogDescription>
//                         Apakah anda yakin untuk menghapus Produk (Finish Good){" "}
//                         <span className="px-1 rounded bg-gray-100 font-medium">{data.name}</span>?
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div>
//                     <label htmlFor="confirm" className="text-sm font-medium text-gray-700">
//                         Konfirmasi
//                     </label>
//                     <Input
//                         name="confirm"
//                         onChange={(e) => setConfirm(e.target.value)}
//                         value={confirm}
//                         placeholder="Tulis kembali nama Produk"
//                         disabled={deleted.isPending}
//                     />
//                     {err && <small className="text-rose-500">{err}</small>}
//                 </div>
//                 <DialogFooter>
//                     <Button
//                         variant={"teal"}
//                         type="button"
//                         size={"sm"}
//                         onClick={() => onConfirm(data.code)}
//                     >
//                         {deleted.isPending ? <Loader2 className="animate-spin" /> : " Yakin"}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
