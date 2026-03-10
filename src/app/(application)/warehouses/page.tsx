import { Suspense } from "react";
import { Warehouse } from "@/components/pages/warehouse";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function WarehousePage() {
    return (
        <Suspense fallback={<WarehouseLoading />}>
            <Warehouse />
        </Suspense>
    );
}

function WarehouseLoading() {
    return (
        <section className="space-y-6">
            <header className="flex justify-between items-center">
                <Skeleton className="h-9 w-48" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="shadow-sm">
                        <CardHeader className="flex flex-row justify-between p-4 pb-2">
                            <Skeleton className="h-5 w-32" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center py-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                        </CardContent>
                        <CardFooter className="p-2 border-t flex gap-2">
                            <Skeleton className="h-8 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
