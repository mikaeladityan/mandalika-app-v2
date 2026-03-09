"use client";

import { useFormWarehouse } from "@/app/(application)/warehouses/server/use.warehouse";
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
import { useForm } from "react-hook-form";

export function CreateWarehouse() {
    const { create } = useFormWarehouse();

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
            },
        },
    });

    const typeOptions = [
        { label: "Bahan Baku", value: "RAW_MATERIAL" },
        { label: "Produk Jadi", value: "FINISH_GOODS" },
    ];
    const onSubmit = async (body: RequestWarehouseDTO) => {
        await create.mutateAsync(body);
        form.reset();
    };

    const onReset = () => {
        form.reset();
    };

    const isPending = create.isPending;

    return (
        <section>
            <Form
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-3 xl:grid-cols-4 2xl:w-8/12"
            >
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl">Informasi Gudang</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5">
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

                        <div className="grid grid-cols-2 gap-5">
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

                <Card className="h-fit">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <Button
                            type="button"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => window.history.back()}
                            variant="default"
                            disabled={isPending}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={onReset}
                            className="cursor-pointer"
                            variant="warning"
                            disabled={isPending}
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground italic">
                            Pastikan data alamat sudah sesuai dengan lokasi fisik gudang untuk
                            memudahkan logistik.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full cursor-pointer"
                            variant="teal"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Simpan Gudang
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <MapPin className="size-5" /> Detail Lokasi & Alamat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        <TextareaForm
                            required
                            control={form.control}
                            name="warehouse_address.street"
                            label="Alamat Lengkap (Jalan)"
                            placeholder="Jl. Raya Boulevard No. 123..."
                            disabled={isPending}
                            error={form.formState.errors.warehouse_address?.street}
                        />
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
                            placeholder="Samping gedung biru, masuk lewat gerbang belakang..."
                            disabled={isPending}
                            error={form.formState.errors.warehouse_address?.notes}
                        />
                    </CardContent>
                </Card>
            </Form>
        </section>
    );
}
