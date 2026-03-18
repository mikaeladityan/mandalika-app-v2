"use client";

import {
    RequestRawMaterialUnitDTO,
    RequestRawMaterialUnitSchema,
} from "@/app/(application)/rawmat/(component)/units/server/unit.schema";
import { useFormUnit, useUnit } from "@/app/(application)/rawmat/(component)/units/server/use.unit";
import { useAuth } from "@/app/auth/server/use.auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { Option } from "@/components/ui/form/select";
import { STATUS } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function EditUnit() {
    const { id } = useParams();
    const { update } = useFormUnit(Number(id));
    const { unit } = useUnit(undefined, Number(id));
    const form = useForm<Partial<RequestRawMaterialUnitDTO>>({
        resolver: zodResolver(RequestRawMaterialUnitSchema.partial()),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (!unit.data) return;

        form.reset({
            name: unit.data?.name ?? "",
        });
    }, [unit.data, form]);

    const onSubmit = async (body: Partial<RequestRawMaterialUnitDTO>) => {
        await update.mutateAsync(body);
        form.reset();
    };

    return (
        <>
            <Form
                methods={form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-3 xl:grid-cols-4 2xl:w-8/12"
            >
                {/* LEFT */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Edit Raw Material: {unit.data?.name}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-5">
                        <InputForm
                            control={form.control}
                            disabled={update.isPending}
                            name="name"
                            label="Nama Satuan"
                            placeholder="Satuan..."
                            type="text"
                            error={form.formState.errors.name}
                        />
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
