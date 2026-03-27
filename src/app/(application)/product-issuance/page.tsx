import { Suspense } from "react";
import { Issuance } from "@/components/pages/product-issuance";
import { TableSkeleton } from "@/components/ui/usage/table.skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IssuancePage() {
    return (
        <Suspense fallback={<IssuanceLoading />}>
            <Issuance />
        </Suspense>
    );
}

function IssuanceLoading() {
    return (
        <section className="space-y-6">
            <header className="space-y-1 mb-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </header>

            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex flex-col gap-4 justify-start items-start md:items-start">
                        <Skeleton className="h-10 w-full md:max-w-sm" />
                    </div>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
                        <div className="flex gap-2 w-full lg:w-auto">
                            <Skeleton className="h-9 w-32" />
                            <Skeleton className="h-9 w-32" />
                            <Skeleton className="h-9 w-48" />
                            <Skeleton className="h-9 w-40" />
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                            <Skeleton className="h-9 w-32" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <TableSkeleton />
                </CardContent>
            </Card>
        </section>
    );
}
