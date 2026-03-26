import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
export function TableSkeleton() {
    return (
        <div className="w-full space-y-6">
            {/* Table Skeleton */}
            <div className="rounded border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {Array.from({ length: 7 }).map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-full max-w-30" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Array.from({ length: 8 }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: 7 }).map((_, colIndex) => (
                                    <TableCell key={colIndex} className="py-4">
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between px-2">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </div>
    );
}
