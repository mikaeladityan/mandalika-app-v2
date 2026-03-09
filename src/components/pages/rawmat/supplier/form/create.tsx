"use client";

import {
    RequestSupplierDTO,
    RequestSupplierSchema,
} from "@/app/(application)/rawmat/suppliers/server/supplier.schema";
import { useFormSupplier } from "@/app/(application)/rawmat/suppliers/server/use.supplier";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useForm } from "react-hook-form";

export function CreateSupplier() {
    const { create } = useFormSupplier();
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
                            disabled={create.isPending}
                            name="name"
                            label="Nama Supplier"
                            placeholder="PT xXx..."
                            type="text"
                            error={form.formState.errors.name}
                        />
                        <div />
                        <InputForm
                            control={form.control}
                            disabled={create.isPending}
                            name="country"
                            label="Negara Supplier"
                            placeholder="Cth..."
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
                        <div className="col-span-2">
                            <InputForm
                                control={form.control}
                                disabled={create.isPending}
                                name="addresses"
                                label="Alamat Lengkap Supplier"
                                placeholder="Jl. XxX..."
                                type="text"
                                error={form.formState.errors.phone}
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
                        <Button className="w-full" disabled={create.isPending} variant="teal">
                            {create.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                            Simpan
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </>
    );
}
