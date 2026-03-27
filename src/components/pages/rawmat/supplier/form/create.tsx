"use client";

import {
    RequestSupplierDTO,
    RequestSupplierSchema,
} from "@/app/(application)/rawmat/(component)/suppliers/server/supplier.schema";
import { useFormSupplier } from "@/app/(application)/rawmat/(component)/suppliers/server/use.supplier";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateSupplierBodyProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function CreateSupplierBody({
    onSuccess,
    onCancel,
    pageMode = false,
}: CreateSupplierBodyProps) {
    const { create } = useFormSupplier();
    const router = useRouter();

    const form = useForm<RequestSupplierDTO>({
        resolver: zodResolver(RequestSupplierSchema),
        defaultValues: {
            name: "",
            addresses: "",
            country: "",
            phone: "",
        },
    });

    const onSubmit = async (body: RequestSupplierDTO) => {
        await create.mutateAsync(body);
        if (onSuccess) {
            onSuccess();
        } else {
            form.reset();
            router.push("/rawmat/suppliers");
        }
    };

    const Content = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputForm
                control={form.control}
                disabled={create.isPending}
                name="name"
                label="Nama Supplier"
                placeholder="PT xXx..."
                type="text"
                error={form.formState.errors.name}
            />

            <InputForm
                control={form.control}
                disabled={create.isPending}
                name="country"
                label="Negara Supplier"
                placeholder="Cth: Indonesia..."
                type="text"
                error={form.formState.errors.country}
            />
            <InputForm
                control={form.control}
                disabled={create.isPending}
                name="phone"
                label="Kontak Supplier"
                placeholder="0 853 XXXX XXXX..."
                type="text"
                error={form.formState.errors.phone}
            />
            <div className="md:col-span-2">
                <InputForm
                    control={form.control}
                    disabled={create.isPending}
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
                className="w-full"
                disabled={create.isPending}
                size={pageMode ? "default" : "sm"}
            >
                {create.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Supplier
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
                                Tambah Supplier Baru
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

export function CreateSupplier() {
    return (
        <div className="container mx-auto py-6">
            <CreateSupplierBody pageMode />
        </div>
    );
}
