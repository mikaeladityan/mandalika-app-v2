"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    RequestOutletDTO,
    RequestOutletSchema,
    ResponseOutletDTO,
} from "@/app/(application)/outlets/server/outlet.schema";
import { useFormOutlet } from "@/app/(application)/outlets/server/use.outlet";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form/main";
import { InputForm } from "@/components/ui/form/input";
import { SelectForm } from "@/components/ui/form/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Store, MapPin, Save, ArrowLeft, Loader2, Globe } from "lucide-react";
import { useWarehouseStatic } from "@/app/(application)/warehouses/server/use.warehouse";
import { useEffect } from "react";

function SeparatorLabel({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 my-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                {label}
            </span>
            <div className="h-px bg-slate-100 w-full" />
        </div>
    );
}

interface OutletFormProps {
    id?: number;
    initialData?: ResponseOutletDTO;
}

export function OutletForm({ id, initialData }: OutletFormProps) {
    const router = useRouter();
    const { create, update } = useFormOutlet(id);
    const { data: warehouseList, isLoading: isWHLoading } = useWarehouseStatic({
        type: "FINISH_GOODS",
        sortBy: "name",
        sortOrder: "asc",
        take: 100,
    });

    const form = useForm<RequestOutletDTO>({
        resolver: zodResolver(RequestOutletSchema) as any,
        defaultValues: {
            name: "",
            code: "",
            phone: "",
            warehouse_id: undefined as any,
            address: {
                street: "",
                district: "",
                sub_district: "",
                city: "",
                province: "",
                country: "Indonesia",
                postal_code: "",
                notes: "",
                url_google_maps: "",
            },
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                code: initialData.code,
                phone: initialData.phone ?? "",
                warehouse_id: initialData.warehouse_id,
                address: initialData.address
                    ? {
                          ...initialData.address,
                          notes: initialData.address.notes ?? "",
                          url_google_maps: initialData.address.url_google_maps ?? "",
                      }
                    : undefined,
            });
        }
    }, [initialData]);

    const onSubmit = async (data: RequestOutletDTO) => {
        if (id) {
            await update.mutateAsync(data);
        } else {
            await create.mutateAsync(data);
        }
        router.push("/outlets");
    };

    const isSubmitting = create.isPending || update.isPending;

    return (
        <Form
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 lg:grid-cols-12 pb-20"
        >
            {/* Kolom Kiri: Informasi Utama & Alamat */}
            <div className="lg:col-span-8 space-y-6">
                <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardHeader className="border-b bg-white/50">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <div className="h-4 w-1 bg-primary rounded-full" />
                            <Store className="text-primary" size={18} />
                            Informasi Dasar Outlet
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-6">
                        <div className="grid md:grid-cols-2 items-start gap-5">
                            <InputForm
                                control={form.control}
                                name="name"
                                label="Nama Outlet"
                                placeholder="Contoh: Mandalika Store Bali"
                                error={form.formState.errors.name as any}
                            />
                            <InputForm
                                control={form.control}
                                name="code"
                                label="Kode Unik"
                                placeholder="MND-BALI-01"
                                className="uppercase"
                                error={form.formState.errors.code as any}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 items-start gap-5">
                            <InputForm
                                control={form.control}
                                name="phone"
                                label="Nomor Telepon"
                                placeholder="081234567890"
                                error={form.formState.errors.phone as any}
                            />
                            <SelectForm
                                control={form.control}
                                name="warehouse_id"
                                label="Gudang Barang Jadi (Finish Goods)"
                                placeholder="Pilih gudang FG..."
                                options={
                                    warehouseList?.map((w) => ({
                                        value: w.id,
                                        label: w.name,
                                    })) ?? []
                                }
                                isLoading={isWHLoading}
                                canSearching={true}
                                description="Hanya gudang bertipe Barang Jadi yang dapat dipilih."
                                error={form.formState.errors.warehouse_id as any}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
                    <CardHeader className="border-b bg-white/50">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <MapPin className="text-rose-500" size={18} />
                            Lokasi Geografis & Alamat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 pt-6">
                        <InputForm
                            control={form.control}
                            name="address.street"
                            label="Jalan / Detail Alamat"
                            placeholder="Jl. Sunset Road No. 100, Kuta"
                            error={form.formState.errors.address?.street as any}
                        />

                        <SeparatorLabel label="Wilayah Adminstratif" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <InputForm
                                control={form.control}
                                name="address.province"
                                label="Provinsi"
                                placeholder="Bali"
                                error={form.formState.errors.address?.province as any}
                            />
                            <InputForm
                                control={form.control}
                                name="address.city"
                                label="Kota / Kabupaten"
                                placeholder="Badung"
                                error={form.formState.errors.address?.city as any}
                            />
                            <InputForm
                                control={form.control}
                                name="address.district"
                                label="Kecamatan"
                                placeholder="Kuta"
                                error={form.formState.errors.address?.district as any}
                            />
                            <InputForm
                                control={form.control}
                                name="address.sub_district"
                                label="Kelurahan"
                                placeholder="Seminyak"
                                error={form.formState.errors.address?.sub_district as any}
                            />
                            <InputForm
                                control={form.control}
                                name="address.postal_code"
                                label="Kode Pos"
                                placeholder="80361"
                                maxLength={6}
                                error={form.formState.errors.address?.postal_code as any}
                            />
                            <InputForm
                                control={form.control}
                                name="address.country"
                                label="Negara"
                                disabled
                                error={form.formState.errors.address?.country as any}
                            />
                        </div>

                        <SeparatorLabel label="Link Eksternal & Catatan" />

                        <div className="grid md:grid-cols-2 gap-5">
                            <InputForm
                                control={form.control}
                                name="address.url_google_maps"
                                label="Link Google Maps"
                                placeholder="https://goo.gl/maps/..."
                                error={form.formState.errors.address?.url_google_maps as any}
                            />
                            <InputForm
                                control={form.control}
                                name="address.notes"
                                label="Catatan Tambahan"
                                placeholder="Samping gedung biru..."
                                error={form.formState.errors.address?.notes as any}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Kolom Kanan: Actions */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="h-fit border-none shadow-sm pt-0 rounded-xl overflow-hidden sticky top-6 bg-white">
                    <CardHeader className="bg-slate-50 border-b pt-4 px-6">
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size="sm"
                                className="rounded-lg shadow-sm border-slate-200"
                                onClick={() => router.back()}
                                variant="outline"
                            >
                                <ArrowLeft size={14} className="mr-2" />
                                Batal
                            </Button>
                            <div className="text-[10px] font-bold uppercase text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                                {id ? "Mode Edit" : "Data Baru"}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                            <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-2">
                                <Globe size={14} className="text-primary" />
                                POS Integration
                            </h4>
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                Outlet yang terdaftar akan muncul sebagai titik sinkronisasi stok di
                                aplikasi POS.
                            </p>
                        </div>

                        <div className="space-y-1.5 px-1">
                            <h3 className="text-lg font-bold tracking-tight text-slate-900">
                                {id ? "Perbarui Outlet" : "Klik Simpan"}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Pastikan koordinasi gudang sumber sudah tepat untuk sinkronisasi
                                stok real-time antar lokasi.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 border-none"
                        >
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Save size={18} className="mr-2" />
                            )}
                            {id ? "Simpan Perubahan" : "Daftarkan Outlet"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Form>
    );
}
