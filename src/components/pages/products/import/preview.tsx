import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductImportPreviewDTO } from "@/app/(application)/products/import/server/import.schema";

export function PreviewTable({ rows }: { rows: ProductImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Edar (%)</TableHead>
                    <TableHead>Safety (%)</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.gender}</TableCell>
                        <TableCell>{row.size}</TableCell>
                        <TableCell>{row.type ?? "-"}</TableCell>
                        <TableCell>{row.unit ?? "-"}</TableCell>
                        <TableCell>
                            {((row.distribution_percentage ?? 0) * 100).toFixed(0)}%
                        </TableCell>
                        <TableCell>{((row.safety_percentage ?? 0) * 100).toFixed(0)}%</TableCell>
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
