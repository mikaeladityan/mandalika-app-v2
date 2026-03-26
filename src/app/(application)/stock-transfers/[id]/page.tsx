"use client";

import { Box, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StockTransferDetail } from "@/components/pages/stock-transfers/stock-transfer-detail";
import { Button } from "@/components/ui/button";

export default function StockTransferDetailPage() {
    const params = useParams();
    const id = Number(params.id);

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/stock-transfers">
                        <Button variant="ghost" size="icon" className="h-10 w-10 border border-slate-100 bg-white rounded-xl text-slate-400 hover:text-slate-900 shadow-sm">
                            <ChevronLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Detail Stock Transfer
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">
                            Pantau status dan kelola proses pemindahan barang antar lokasi.
                        </p>
                    </div>
                </div>
            </div>

            <StockTransferDetail id={id} />
        </section>
    );
}
