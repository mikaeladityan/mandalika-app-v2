"use client";

import {
    RequestSupplierDTO,
    RequestSupplierSchema,
} from "@/app/(application)/rawmat/(component)/suppliers/server/supplier.schema";
import {
    useFormSupplier,
    useSupplier,
} from "@/app/(application)/rawmat/(component)/suppliers/server/use.supplier";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

interface EditSupplierBodyProps {
    id?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function EditSupplierBody({
    id: propId,
    onSuccess,
    onCancel,
    pageMode = false,
}: EditSupplierBodyProps) {
    const params = useParams();
    const id = propId ?? Number(params.id);
    const { update } = useFormSupplier(id);
    const { supplier } = useSupplier(undefined, id);
    const router = useRouter();

    const form = useForm<Partial<RequestSupplierDTO>>({
        resolver: zodResolver(RequestSupplierSchema.partial()),
        defaultValues: {
            name: "",
            addresses: "",
            country: "",
            phone: "",
        },
    });

    useEffect(() => {
        if (!supplier.data) return;

        form.reset({
            name: supplier.data?.name ?? "",
            addresses: supplier.data?.addresses ?? "",
            phone: supplier.data?.phone ?? "",
            country: supplier.data?.country ?? "",
        });
    }, [supplier.data, form]);

    const onSubmit = async (body: Partial<RequestSupplierDTO>) => {
        await update.mutateAsync(body);
        if (onSuccess) {
            onSuccess();
        } else {
            router.push("/rawmat/suppliers");
        }
    };

    if (supplier.isLoading) {
        return (
            <div className="p-8 text-center text-muted-foreground animate-pulse">
                Loading data...
            </div>
        );
    }

    const Content = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputForm
                control={form.control}
                disabled={update.isPending}
                name="name"
                label="Nama Supplier"
                placeholder="PT xXx..."
                type="text"
                error={form.formState.errors.name}
            />

            <InputForm
                control={form.control}
                disabled={update.isPending}
                name="country"
                label="Negara Supplier"
                placeholder="Cth: Indonesia..."
                type="text"
                error={form.formState.errors.country}
            />
            <InputForm
                control={form.control}
                disabled={update.isPending}
                name="phone"
                label="Kontak Supplier"
                placeholder="0 853 XXXX XXXX..."
                type="text"
                error={form.formState.errors.phone}
            />
            <div className="md:col-span-2">
                <InputForm
                    control={form.control}
                    disabled={update.isPending}
                    name="addresses"
                    label="Alamat Lengkap Supplier"
                    placeholder="Jl. XxX..."
                    type="text"
                    error={form.formState.errors.addresses}
                />
            </div>
        </div>
    );

    const Actions = (
        <div className={cn("flex flex-col gap-2", !pageMode && "pt-4")}>
            {!pageMode && (
                <Button
                    variant="ghost"
                    className="w-full"
                    size="sm"
                    type="button"
                    onClick={onCancel}
                >
                    Batal
                </Button>
            )}
            <Button
                className="w-full font-bold"
                disabled={update.isPending}
                size={pageMode ? "default" : "sm"}
            >
                {update.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Perubahan
            </Button>
        </div>
    );

    return (
        <Form
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("grid gap-5", pageMode ? "xl:grid-cols-4" : "grid-cols-1")}
        >
            {pageMode ? (
                <>
                    <Card className="col-span-3 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                Edit Supplier: {supplier.data?.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">{Content}</CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row justify-between items-center gap-2 space-y-0 pb-4 border-b">
                            <Button
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                            </Button>
                            <Button
                                size="sm"
                                type="button"
                                variant="warning"
                                onClick={() => form.reset()}
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </CardHeader>
                        <CardFooter>{Actions}</CardFooter>
                    </Card>
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

// ─── Standalone Page Wrapper ───────────────────────────────────────────────

export function EditSupplier() {
    return (
        <div className="container mx-auto py-6">
            <EditSupplierBody pageMode />
        </div>
    );
}
