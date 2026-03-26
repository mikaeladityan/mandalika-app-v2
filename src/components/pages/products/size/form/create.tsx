"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import {
    RequestSizeDTO,
    RequestSizeSchema,
} from "@/app/(application)/products/(component)/size/server/size.schema";
import { useActionSize } from "@/app/(application)/products/(component)/size/server/use.size";

export function CreateSize() {
    const { create } = useActionSize();
    const form = useForm<RequestSizeDTO>({
        resolver: zodResolver(RequestSizeSchema) as any,
        defaultValues: {
            size: undefined as any,
        },
    });

    const onSubmit = async (body: RequestSizeDTO) => {
        await create.mutateAsync(body);
        form.reset();
    };

    return (
        <Form
            methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 xl:grid-cols-4 2xl:w-8/12"
        >
            {/* LEFT */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Tambah Ukuran Baru</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5">
                    <InputForm
                        control={form.control}
                        disabled={create.isPending}
                        name="size"
                        label="Ukuran (Angka ML)"
                        placeholder="Contoh: 30, 50, 100..."
                        type="number"
                        error={form.formState.errors.size}
                    />
                </CardContent>
            </Card>

            {/* RIGHT */}
            <Card className="h-fit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <Button size="sm"  type="button" variant="outline"  onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>

                    <Button size="sm"  type="button" variant="ghost"  onClick={() => form.reset()}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardFooter>
                    <Button size="sm"   className="w-full" disabled={create.isPending}>
                        {create.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Simpan Ukuran
                    </Button>
                </CardFooter>
            </Card>
        </Form>
    );
}
