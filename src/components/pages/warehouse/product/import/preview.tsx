import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { ProductInventoryImportPreviewDTO } from "@/app/(application)/warehouses/[id]/import/server/import.schema";

export function PreviewTable({ rows }: { rows: ProductInventoryImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>
                            {row.name} {row.type.toUpperCase()} {row.size.toUpperCase()}
                        </TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>
                            <Badge variant={row.errors.length ? "destructive" : "default"}>
                                {row.errors.length ? "Invalid" : "Valid"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
