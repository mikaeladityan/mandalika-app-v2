"use client";

import { useOutlet } from "@/app/(application)/outlets/server/use.outlet";
import { OutletForm } from "@/components/pages/outlets/form/outlet-form";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
    const { id } = use(params);
    const { data, isLoading } = useOutlet(Number(id));

    if (isLoading) {
        return (
            <div className="space-y-4 max-w-4xl mx-auto p-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    return <OutletForm id={Number(id)} initialData={data} />;
}
