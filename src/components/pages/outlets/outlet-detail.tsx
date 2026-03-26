"use client";

import { useOutlet } from "@/app/(application)/outlets/server/use.outlet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import { InventoryTab } from "@/components/pages/outlets/inventory/inventory-tab";

interface OutletDetailProps {
    id: number;
}

export function OutletDetail({ id }: OutletDetailProps) {
    const { data, isLoading } = useOutlet(id);

    if (isLoading) {
        return (
            <div className="space-y-4 w-full">
                <Skeleton className="h-12 w-full max-w-md hidden md:block" />
                <Skeleton className="h-8 w-full md:hidden" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <Skeleton className="h-[400px] w-full mt-6" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
                Data outlet tidak ditemukan.
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full pb-20">
            {/* Header section with back button and actions */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl h-9 w-9 text-slate-500 hover:text-slate-800">
                        <Link href="/outlets">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">{data.name}</h1>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Kelola informasi dan stok outlet <span className="font-mono text-slate-500">{data.code}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-0 sm:self-end">
                    <Button
                        asChild
                        className="rounded-xl shadow-md h-10 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Link href={`/outlets/${id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Outlet
                        </Link>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-xl h-auto">
                    <TabsTrigger value="general" className="rounded-lg font-bold py-2.5 text-xs sm:text-sm">
                        Informasi Umum
                    </TabsTrigger>
                    <TabsTrigger value="inventory" className="rounded-lg font-bold py-2.5 text-xs sm:text-sm">
                        Stok / Inventory
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="mt-6">
                    <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Nama Outlet
                                </h3>
                                <p className="font-bold text-slate-800 text-sm sm:text-base">{data.name}</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Kode Outlet
                                </h3>
                                <p className="font-bold text-slate-800 text-sm sm:text-base font-mono bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md w-fit">
                                    {data.code}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Status
                                </h3>
                                <div>
                                    <span
                                        className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide inline-block ${data.is_active ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"}`}
                                    >
                                        {data.is_active ? "Aktif Beroperasi" : "Tidak Aktif"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Gudang Utama (Parent)
                                </h3>
                                <p className="font-bold text-slate-800 text-sm sm:text-base">
                                    {data.warehouse?.name || "-"}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    PIC / Nomor Kontak
                                </h3>
                                <p className="font-bold text-slate-800 text-sm sm:text-base">
                                    {data.phone || "-"}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Alamat Lengkap
                                </h3>
                                <p className="font-medium text-slate-700 text-sm leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                    {data.address
                                        ? `${data.address.street}, ${data.address.district}, ${data.address.city}, ${data.address.province}`
                                        : "Alamat belum diatur"}
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                
                <TabsContent value="inventory" className="mt-6">
                    <InventoryTab outletId={id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
