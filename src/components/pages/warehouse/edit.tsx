"use client";

import {
    useFormWarehouse,
    useWarehouse,
} from "@/app/(application)/warehouses/server/use.warehouse";
import {
    RequestWarehouseDTO,
    RequestWarehouseSchema,
} from "@/app/(application)/warehouses/server/warehouse.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { SelectForm } from "@/components/ui/form/select";
import { TextareaForm } from "@/components/ui/form/text.area";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, RefreshCcw, Save, Loader2, MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function EditWarehouse() {
    const { id } = useParams();
    const { update } = useFormWarehouse(Number(id));
    const { detail } = useWarehouse(undefined, Number(id));

    const form = useForm<RequestWarehouseDTO>({
        resolver: zodResolver(RequestWarehouseSchema),
        defaultValues: {
            name: "",
            type: "FINISH_GOODS",
            warehouse_address: {
                city: "",
                country: "Indonesia",
                district: "",
                notes: "",
                postal_code: "",
                province: "",
                street: "",
                sub_district: "",
                url_google_maps: "",
            } as any,
        },
    });

    useEffect(() => {
        if (detail) {
            form.reset({
                name: detail.name,
                type: detail.type,
                warehouse_address: {
                    city: detail.warehouse_address?.city ?? "",
                    country: detail.warehouse_address?.country ?? "Indonesia",
                    district: detail.warehouse_address?.district ?? "",
                    notes: detail.warehouse_address?.notes ?? "",
                    postal_code: detail.warehouse_address?.postal_code ?? "",
                    province: detail.warehouse_address?.province ?? "",
                    street: detail.warehouse_address?.street ?? "",
                    sub_district: detail.warehouse_address?.sub_district ?? "",
                    url_google_maps: detail.warehouse_address?.url_google_maps ?? "",
                },
            });
        }
    }, [detail, form.reset]);

    const onSubmit = async (body: RequestWarehouseDTO) => {
        const formattedBody = {
            ...body,
            warehouse_address: body.warehouse_address
                ? {
                      ...body.warehouse_address,
                      notes: body.warehouse_address.notes || null,
                      url_google_maps: body.warehouse_address.url_google_maps || null,
                  }
                : undefined,
        };
        await update.mutateAsync(formattedBody as RequestWarehouseDTO);
    };

    const onReset = () => {
        if (detail) {
            form.reset({
                name: detail.name,
                type: detail.type,
                warehouse_address: {
                    city: detail.warehouse_address?.city ?? "",
                    country: detail.warehouse_address?.country ?? "Indonesia",
                    district: detail.warehouse_address?.district ?? "",
                    notes: detail.warehouse_address?.notes ?? "",
                    postal_code: detail.warehouse_address?.postal_code ?? "",
                    province: detail.warehouse_address?.province ?? "",
                    street: detail.warehouse_address?.street ?? "",
                    sub_district: detail.warehouse_address?.sub_district ?? "",
                    url_google_maps: detail.warehouse_address?.url_google_maps ?? "",
                },
            });
        }
    };

    const isPending = update.isPending;

    const typeOptions = [
        { label: "Bahan Baku", value: "RAW_MATERIAL" },
        { label: "Produk Jadi", value: "FINISH_GOODS" },
    ];

    return (
        <section className="w-full">
            <Form
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6 lg:grid-cols-12"
            >
                {/* Kolom Kiri: Informasi Utama & Alamat */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b bg-white/50">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <div className="h-4 w-1 bg-primary rounded-full" />
                                Edit Informasi Gudang: {detail?.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 pt-6">
                            <div className="grid md:grid-cols-2 gap-5">
                                <InputForm
                                    required
                                    control={form.control}
                                    name="name"
                                    label="Nama Gudang"
                                    placeholder="Contoh: Gudang Distribusi Jakarta"
                                    disabled={isPending}
                                    error={form.formState.errors.name}
                                />
                                <SelectForm
                                    name="type"
                                    control={form.control}
                                    error={form.formState.errors.type}
                                    label={"Tipe Gudang"}
                                    options={typeOptions}
                                    isLoading={isPending}
                                />
                            </div>

                            <SeparatorLabel label="Lokasi Wilayah" />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <InputForm
                                    required
                                    control={form.control}
                                    name="warehouse_address.province"
                                    label="Provinsi"
                                    placeholder="Jawa Barat"
                                    disabled={isPending}
                                    error={form.formState.errors.warehouse_address?.province}
                                />
                                <InputForm
                                    required
                                    control={form.control}
                                    name="warehouse_address.city"
                                    label="Kota/Kabupaten"
                                    placeholder="Bekasi"
                                    disabled={isPending}
                                    error={form.formState.errors.warehouse_address?.city}
                                />
                                <InputForm
                                    control={form.control}
                                    name="warehouse_address.district"
                                    label="Kecamatan"
                                    placeholder="Tambun Selatan"
                                    disabled={isPending}
                                    error={form.formState.errors.warehouse_address?.district}
                                />
                                <InputForm
                                    control={form.control}
                                    name="warehouse_address.sub_district"
                                    label="Kelurahan"
                                    placeholder="Lambangjaya"
                                    disabled={isPending}
                                    error={form.formState.errors.warehouse_address?.sub_district}
                                />
                                <InputForm
                                    control={form.control}
                                    name="warehouse_address.postal_code"
                                    label="Kode Pos"
                                    placeholder="17510"
                                    disabled={isPending}
                                    error={form.formState.errors.warehouse_address?.postal_code}
                                />
                                <InputForm
                                    control={form.control}
                                    name="warehouse_address.country"
                                    label="Negara"
                                    disabled={true}
                                    error={form.formState.errors.warehouse_address?.country}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="border-b bg-white/50">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MapPin className="size-5 text-rose-500" />
                                Update Detail Alamat & G-Maps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 pt-6">
                            <TextareaForm
                                required
                                control={form.control}
                                name="warehouse_address.street"
                                label="Alamat Lengkap (Jalan)"
                                placeholder="Jl. Raya Boulevard No. 123..."
                                disabled={isPending}
                                error={form.formState.errors.warehouse_address?.street}
                            />
                            <div className="grid md:grid-cols-2 gap-5">
                                <InputForm
                                    control={form.control}
                                    name="warehouse_address.url_google_maps"
                                    label="URL Google Maps"
                                    placeholder="https://maps.app.goo.gl/..."
                                    disabled={isPending}
                                    error={form.formState.errors.warehouse_address?.url_google_maps}
                                />
                                <TextareaForm
                                    control={form.control}
                                    name="warehouse_address.notes"
                                    label="Catatan Alamat"
                                    placeholder="Samping gedung biru..."
                                    disabled={isPending}
                                    error={form.formState.errors.warehouse_address?.notes}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan: Actions */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="h-fit border-none shadow-sm pt-0 rounded-xl overflow-hidden sticky top-6">
                        <CardHeader className="bg-slate-50 border-b pt-4">
                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => window.history.back()}
                                    variant="outline"
                                    disabled={isPending}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={onReset}
                                    className="cursor-pointer"
                                    variant="ghost"
                                    disabled={isPending}
                                >
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                                <h4 className="text-sm font-bold text-teal-900 mb-1">Informasi</h4>
                                <p className="text-xs text-teal-700 leading-relaxed italic">
                                    Pembaruan data alamat akan langsung berdampak pada pencatatan
                                    logistik dan distribusi barang.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Button
                                className="w-full h-11 cursor-pointer font-bold shadow-md shadow-teal-100"
                                variant="teal"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Perbarui Data Gudang
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </Form>
        </section>
    );
}

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
