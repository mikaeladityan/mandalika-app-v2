"use client";

import {
    RequestRawMaterialUnitDTO,
    RequestRawMaterialUnitSchema,
} from "@/app/(application)/rawmat/(component)/units/server/unit.schema";
import { useFormUnit } from "@/app/(application)/rawmat/(component)/units/server/use.unit";
import { useAuth } from "@/app/auth/server/use.auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { Option, SelectForm } from "@/components/ui/form/select";
import { STATUS } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateUnitBodyProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function CreateUnitBody({ onSuccess, onCancel, pageMode = false }: CreateUnitBodyProps) {
    const { account } = useAuth();
    const { create } = useFormUnit();
    const router = useRouter();

    const form = useForm<RequestRawMaterialUnitDTO>({
        resolver: zodResolver(RequestRawMaterialUnitSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (body: RequestRawMaterialUnitDTO) => {
        await create.mutateAsync(body);
        if (onSuccess) {
            onSuccess();
        } else {
            form.reset();
            router.push("/rawmat/units");
        }
    };

    const Content = (
        <div className="grid grid-cols-1 gap-5">
            <InputForm
                control={form.control}
                disabled={create.isPending}
                name="name"
                label="Nama Satuan"
                placeholder="Ketik nama satuan (cth: Kg, Ltr)..."
                type="text"
                error={form.formState.errors.name}
            />
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
                Simpan Unit
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
                                Tambah Unit Raw Material
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">{Content}</CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row justify-between items-center gap-2 space-y-0">
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

export function CreateUnit() {
    return (
        <div className="container mx-auto py-6">
            <CreateUnitBody pageMode />
        </div>
    );
}
