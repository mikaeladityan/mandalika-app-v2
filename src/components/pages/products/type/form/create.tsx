"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import {
    RequestTypeDTO,
    RequestTypeSchema,
} from "@/app/(application)/products/(component)/type/server/type.schema";
import { useActionType } from "@/app/(application)/products/(component)/type/server/use.type";

export function CreateType() {
    const { create } = useActionType();
    const form = useForm<RequestTypeDTO>({
        resolver: zodResolver(RequestTypeSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (body: RequestTypeDTO) => {
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
                    <CardTitle className="text-xl font-bold">Tambah Tipe Produk</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5">
                    <InputForm
                        control={form.control}
                        disabled={create.isPending}
                        name="name"
                        label="Nama Tipe"
                        placeholder="Contoh: EDP, Body Mist, Face Wash..."
                        type="text"
                        error={form.formState.errors.name}
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
                        Simpan Tipe
                    </Button>
                </CardFooter>
            </Card>
        </Form>
    );
}
