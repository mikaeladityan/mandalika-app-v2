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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { SelectForm } from "@/components/ui/form/select";
import { TextareaForm } from "@/components/ui/form/text.area";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, RefreshCcw, Save, Loader2, MapPin, Box } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

interface UpdateWarehouseBodyProps {
    id: number;
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function UpdateWarehouseBody({
    id,
    onSuccess,
    onCancel,
    pageMode = false,
}: UpdateWarehouseBodyProps) {
    const { update } = useFormWarehouse(id);
    const { detail } = useWarehouse(undefined, id);
    const router = useRouter();

    const form = useForm<RequestWarehouseDTO>({
        resolver: zodResolver(RequestWarehouseSchema),
        defaultValues: {
            code: "",
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
                code: detail.code ?? "",
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
    }, [detail, form]);

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
        onSuccess?.();
    };

    const isPending = update.isPending;

    const typeOptions = [
        { label: "Bahan Baku", value: "RAW_MATERIAL" },
        { label: "Produk Jadi", value: "FINISH_GOODS" },
    ];

    const renderCard = (title: string, description: string, children: React.ReactNode, icon?: React.ReactNode) => {
        if (!pageMode) {
            return (
                <div className="space-y-4 pb-6 border-b last:border-0">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 mb-2 italic">
                        <h3 className="text-sm font-bold flex items-center gap-2 italic">
                            {icon}
                            {title}
                        </h3>
                        <p className="text-xs text-muted-foreground italic">{description}</p>
                    </div>
                    <div className="px-1">{children}</div>
                </div>
            );
        }
        return (
            <Card className="shadow-sm border-none rounded-xl overflow-hidden bg-white">
                <CardHeader className="pb-4 bg-slate-50/50 border-b">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        {icon}
                        {title}
                    </CardTitle>
                    <CardDescription className="italic">{description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">{children}</CardContent>
            </Card>
        );
    };

    const Content = (
        <div className="grid gap-8">
            {renderCard(
                `Informasi Gudang: ${detail?.name || ""}`,
                "Identitas dan tipe operasional gudang perusahaan.",
                <div className="grid gap-6">
                    <div className="grid md:grid-cols-3 gap-5 text-slate-800">
                        <InputForm
                            required
                            control={form.control}
                            name="code"
                            label="Kode Gudang"
                            placeholder="Contoh: WH-01"
                            disabled={isPending}
                            error={form.formState.errors.code}
                        />
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
                </div>,
                <Box className="text-primary h-5 w-5" />
            )}

            {renderCard(
                "Detail Alamat & G-Maps",
                "Titik lokasi fisik dan catatan tambahan logistik.",
                <div className="grid gap-6">
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
                </div>,
                <MapPin className="text-rose-500 h-5 w-5" />
            )}
        </div>
    );

    const Actions = (
        <div className={cn("flex gap-2", !pageMode && "pt-6 justify-end border-t mt-4")}>
            {!pageMode && (
                <Button
                    variant="ghost"
                    className="w-1/4 font-medium"
                    size="sm"
                    type="button"
                    onClick={onCancel}
                >
                    Batal
                </Button>
            )}
            <Button
                className={cn(
                    "font-bold shadow-lg shadow-primary/20 transition-all border-none",
                    pageMode ? "w-full h-11 shadow-primary/20" : "w-1/2 rounded-lg"
                )}
                disabled={isPending}
                size={pageMode ? "default" : "sm"}
                type="submit"
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                {pageMode ? "Perbarui Data Gudang" : "Update"}
            </Button>
        </div>
    );

    return (
        <Form
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("grid gap-6", pageMode ? "lg:grid-cols-12 pb-20" : "grid-cols-1")}
        >
            {pageMode ? (
                <>
                    <div className="lg:col-span-8 space-y-6">{Content}</div>
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
                                        disabled={isPending}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => form.reset()}
                                        className="rounded-lg"
                                        variant="ghost"
                                        disabled={isPending}
                                    >
                                        <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 italic">
                                    <h4 className="text-xs font-bold text-slate-900 mb-1 italic">
                                        Informasi
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                        Pembaruan data alamat akan langsung berdampak pada
                                        pencatatan logistik dan distribusi barang.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">{Actions}</CardFooter>
                        </Card>
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    {Content}
                    {Actions}
                </div>
            )}
        </Form>
    );
}

export function EditWarehouse() {
    const { id } = useParams();
    return <UpdateWarehouseBody id={Number(id)} pageMode />;
}

function SeparatorLabel({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 my-2 italic">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap italic">
                {label}
            </span>
            <div className="h-px bg-slate-100 w-full" />
        </div>
    );
}
