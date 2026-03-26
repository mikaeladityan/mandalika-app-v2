"use client";

import { use } from "react";
import { OutletDetail } from "@/components/pages/outlets/outlet-detail";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OutletDetailPage({ params }: PageProps) {
    const { id } = use(params);

    return <OutletDetail id={Number(id)} />;
}
