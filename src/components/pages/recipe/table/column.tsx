"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { SortableHeader } from "@/components/ui/table/sortable";
import {
    QueryRecipeDTO,
    ResponseRecipeDTO,
} from "@/app/(application)/recipes/server/recipe.schema";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type Props = {
    sortBy?: QueryRecipeDTO["sortBy"];
    sortOrder?: QueryRecipeDTO["sortOrder"];
    onSort: (key: string) => void;
};

export const RecipeColumns = ({
    sortBy,
    sortOrder,
    onSort,
}: Props): ColumnDef<ResponseRecipeDTO>[] => [
    {
        id: "product",
        enableHiding: false,
        header: () => (
            <SortableHeader
                label="Product"
                sortKey="product"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) =>
            row.original.product ? (
                <Link href={`/recipes/form/${row.original.product.id}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{row.original.product.code}</p>
                        {row.original.is_active && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                                ACTIVE
                            </span>
                        )}
                    </div>
                    <p className="font-bold tracking-wider">{row.original.product.name}</p>
                    <div className="mt-1 space-x-1">
                        <span className="text-xs font-medium px-2 bg-gray-100 text-gray-600 rounded">
                            {row.original.product.product_type?.name.toUpperCase()}
                        </span>
                        <span className="text-xs font-medium px-2 bg-gray-100 text-gray-600 rounded">
                            {row.original.product.size}{" "}
                            {row.original.product.unit?.name.toUpperCase()}
                        </span>
                    </div>
                </Link>
            ) : (
                "-"
            ),
    },
    {
        accessorKey: "version",
        header: "Version",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">v{row.original.version}</span>
                {row.original.description && (
                    <span className="text-[10px] text-slate-400 max-w-[150px] truncate">
                        {row.original.description}
                    </span>
                )}
            </div>
        ),
    },
    {
        id: "raw_material",
        header: "Raw Material",
        cell: ({ row }) =>
            row.original.raw_material ? (
                <div>
                    <p className="font-medium">{row.original.raw_material.name}</p>
                </div>
            ) : (
                "-"
            ),
    },

    {
        accessorKey: "quantity",
        header: () => (
            <SortableHeader
                label="Kebutuhan Material"
                sortKey="quantity"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            const qty = Number(row.original.quantity);
            const uom = row.original.raw_material?.unit_raw_material?.name?.toUpperCase() || "UNIT";
            return `${qty} ${uom}`;
        },
    },

    {
        id: "current_stock",
        header: () => (
            <SortableHeader
                label="Stok Material"
                sortKey="current_stock"
                activeSortBy={sortBy}
                activeSortOrder={sortOrder}
                onSort={onSort}
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-start gap-1">
                    <p className="font-medium text-gray-500">
                        {Math.round(Number(row.original.raw_material?.current_stock ?? 0))}
                    </p>
                    <p className="text-gray-500 text-xs font-bold">
                        {row.original.raw_material?.unit_raw_material?.name?.toUpperCase() ||
                            "UNIT"}
                    </p>
                </div>
            );
        },
    },
    // {
    //     id: "actions",
    //     header: () => <div className="text-center">Aksi</div>,
    //     cell: ({ row }: any) => (
    //         <div className="text-center">
    //             <Link href={`/recipes/${row.original.id}`}>
    //                 <Button
    //                     variant="ghost"
    //                     size="sm"
    //                     className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
    //                 >
    //                     <Eye className="h-4 w-4 mr-2" />
    //                     Detail
    //                 </Button>
    //             </Link>
    //         </div>
    //     ),
    // },
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
