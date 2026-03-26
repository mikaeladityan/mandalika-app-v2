"use client";

import { useOutlet } from "@/app/(application)/outlets/server/use.outlet";
import { OutletForm } from "@/components/pages/outlets/form/outlet-form";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditOutletPage({ params }: PageProps) {
    const { id } = use(params);
    const { data, isLoading } = useOutlet(Number(id));

    if (isLoading) {
        return (
            <div className="space-y-4 mx-auto p-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 mx-auto p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Edit Outlet: {data?.name}</h1>
                <p className="text-muted-foreground">Perbarui informasi untuk outlet {data?.code}</p>
            </div>
            
            <div className="mt-6">
                <OutletForm id={Number(id)} initialData={data} />
            </div>
        </div>
    );
}
