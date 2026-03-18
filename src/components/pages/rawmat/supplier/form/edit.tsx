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
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function EditSupplier() {
    const { id } = useParams();
    const { update } = useFormSupplier(Number(id));
    const { supplier } = useSupplier(undefined, Number(id));
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
        form.reset();
    };

    return (
        <>
            <Form
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-3 items-start xl:grid-cols-4 2xl:w-8/12"
            >
                {/* LEFT */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl">Tambah Supplier Baru</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-5">
                        <InputForm
                            control={form.control}
                            disabled={update.isPending}
                            name="name"
                            label="Nama Supplier"
                            placeholder="PT xXx..."
                            type="text"
                            error={form.formState.errors.name}
                        />
                        <div />
                        <InputForm
                            control={form.control}
                            disabled={update.isPending}
                            name="country"
                            label="Negara Supplier"
                            placeholder="Cth..."
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
                        <div className="col-span-2">
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
                    </CardContent>
                </Card>

                {/* RIGHT */}
                <Card>
                    <CardHeader className="flex justify-between items-center gap-2">
                        <Button type="button" onClick={() => window.history.back()}>
                            <ArrowLeft /> Kembali
                        </Button>

                        <Button type="button" variant="warning" onClick={() => form.reset()}>
                            Reset <RefreshCcw />
                        </Button>
                    </CardHeader>

                    <CardFooter>
                        <Button className="w-full" disabled={update.isPending}>
                            {update.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                            Simpan
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </>
    );
}
