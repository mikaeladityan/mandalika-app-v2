import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecipeImportPreviewDTO } from "@/app/(application)/recipes/import/server/import.schema";

export function PreviewTable({ rows }: { rows: RecipeImportPreviewDTO[] }) {
    if (!rows.length) return null;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>PRODUCT CODE</TableHead>
                    <TableHead>PRODUCT NAME</TableHead>
                    <TableHead>SIZE</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>MATERIAL CODE</TableHead>
                    <TableHead>MATERIAL NAME</TableHead>
                    <TableHead>QTY</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row, i) => (
                    <TableRow key={i} className={row.errors.length ? "bg-destructive/5" : ""}>
                        <TableCell>{row.product_code || "-"}</TableCell>
                        <TableCell>{row.product_name || "-"}</TableCell>
                        <TableCell>{row.product_size || "-"}</TableCell>
                        <TableCell>{row.product_type || "-"}</TableCell>
                        <TableCell className="font-mono text-xs">{row.material_code || "-"}</TableCell>
                        <TableCell>{row.material_name || "-"}</TableCell>
                        <TableCell>{row.qty ?? "-"}</TableCell>
                        <TableCell>
                            <Badge variant={row.errors.length ? "destructive" : "default"}>
                                {row.errors.length ? "Invalid" : "Valid"}
                            </Badge>
                            {row.errors.length > 0 && (
                                <p className="text-xs text-destructive mt-1">
                                    {row.errors.join(", ")}
                                </p>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
