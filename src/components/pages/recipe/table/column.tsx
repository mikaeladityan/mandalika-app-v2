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
                label="Produk (Finish Good)"
                sortKey="product"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col gap-1 min-w-50 p-2">
                <Link href={`/recipes/form/${row.original.id}`} className="hover:underline">
                    <span className="font-bold text-slate-900 leading-tight">
                        {row.original.name}
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 w-fit px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                        {row.original.code}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 w-fit px-1.5 py-0.5 rounded border border-slate-200 uppercase">
                        {row.original.size?.size} {row.original.unit?.name}
                    </span>
                </div>
                <div className="mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase">
                        {row.original.product_type?.name}
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: "material_details",
        header: () => (
            <div className="grid grid-cols-12 w-full gap-2 px-2">
                <div className="col-span-8 text-left uppercase text-[10px] font-bold text-slate-500">
                    Bahan Baku / Material
                </div>
                <div className="col-span-2 text-right uppercase text-[10px] font-bold text-slate-500">
                    Kebutuhan
                </div>
                <div className="col-span-2 text-right uppercase text-[10px] font-bold text-slate-500">
                    Stok
                </div>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-150">
                {row.original.materials.map((mat, idx) => (
                    <div
                        key={idx}
                        className={`grid grid-cols-12 w-full items-center py-2 px-2 ${
                            idx !== row.original.materials.length - 1
                                ? "border-b border-slate-50"
                                : ""
                        } hover:bg-slate-50/50 transition-colors`}
                    >
                        {/* Nama Material */}
                        <div className="col-span-8 flex flex-col pr-4">
                            <span className="text-sm font-medium text-slate-700">{mat.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {mat.barcode || "-"}
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 text-right">
                            <span className="text-sm font-bold text-slate-700">
                                {Number(mat.quantity).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1 uppercase">
                                {mat.unit}
                            </span>
                        </div>

                        {/* Stock */}
                        <div className="col-span-2 text-right">
                            <span
                                className={`text-sm font-medium ${
                                    Number(mat.stock) < Number(mat.quantity)
                                        ? "text-rose-500"
                                        : "text-slate-500"
                                }`}
                            >
                                {Math.round(Number(mat.stock)).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1 uppercase">
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
                label="Total"
                sortKey="totalMaterial"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => (
            <div className="flex flex-col items-center justify-center gap-1 text-slate-500 min-w-24">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    <Beaker className="h-3 w-3" />
                    <span className="text-xs font-bold leading-none">
                        {row.original.total_material || 0}
                    </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-tighter">Material</span>
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
