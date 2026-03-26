import { Suspense } from "react";
import { ImportSalesForm } from "@/components/pages/sales/import";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImportSalesPage() {
    return (
        <Suspense fallback={<ImportSalesLoading />}>
            <ImportSalesForm />
        </Suspense>
    );
}

function ImportSalesLoading() {
    return (
        <section className="space-y-6">
            <header className="space-y-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </header>

            <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b p-6">
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
