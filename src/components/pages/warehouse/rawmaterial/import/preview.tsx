import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RawMaterialInventoryImportPreviewDTO } from "@/app/(application)/warehouses/[id]/rawmat-import/server/import.schema";

export function PreviewTable({ rows }: { rows: RawMaterialInventoryImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>BARCODE</TableHead>
                    <TableHead>MATERIAL</TableHead>
                    <TableHead>KATEGORI</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{row.barcode}</TableCell>
                        <TableCell>
                            {row.name} {row.name.toUpperCase()}
                        </TableCell>
                        <TableCell>{row.category}</TableCell>
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
