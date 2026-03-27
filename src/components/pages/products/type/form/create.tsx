"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import {
    RequestTypeDTO,
    RequestTypeSchema,
    ResponseTypeDTO,
} from "@/app/(application)/products/(component)/type/server/type.schema";
import { useActionType } from "@/app/(application)/products/(component)/type/server/use.type";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Reusable Form Body ────────────────────────────────────────────────────

interface CreateTypeBodyProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function CreateTypeBody({ onSuccess, onCancel, pageMode = false }: CreateTypeBodyProps) {
    const { create } = useActionType();
    const router = useRouter();
    const form = useForm<RequestTypeDTO>({
        resolver: zodResolver(RequestTypeSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (body: RequestTypeDTO) => {
        await create.mutateAsync(body);
        form.reset();
        onSuccess?.();
    };

    const Content = (
        <div className="grid grid-cols-1 gap-5">
            <InputForm
                control={form.control}
                disabled={create.isPending}
                name="name"
                label="Nama Tipe"
                placeholder="Contoh: EDP, Body Mist, Face Wash..."
                type="text"
                autoFocus
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
                Simpan Tipe
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
                            <CardTitle className="text-xl font-bold">Tambah Tipe Baru</CardTitle>
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

// ─── Update Form Body ────────────────────────────────────────────────────

interface UpdateTypeBodyProps {
    initialData: ResponseTypeDTO;
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function UpdateTypeBody({
    initialData,
    onSuccess,
    onCancel,
    pageMode = false,
}: UpdateTypeBodyProps) {
    const { update } = useActionType();
    const router = useRouter();
    const form = useForm<RequestTypeDTO>({
        resolver: zodResolver(RequestTypeSchema),
        defaultValues: {
            name: initialData.name,
        },
    });

    const onSubmit = async (body: RequestTypeDTO) => {
        await update.mutateAsync({ id: initialData.id, body });
        onSuccess?.();
    };

    const Content = (
        <div className="grid grid-cols-1 gap-5">
            <InputForm
                control={form.control}
                disabled={update.isPending}
                name="name"
                label="Nama Tipe"
                placeholder="Contoh: EDP, Body Mist, Face Wash..."
                type="text"
                autoFocus
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
                className="w-full font-bold"
                disabled={update.isPending}
                size={pageMode ? "default" : "sm"}
            >
                {update.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                Update Tipe
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
                            <CardTitle className="text-xl font-bold">Update Tipe</CardTitle>
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

// ─── Standalone Page (mobile) ──────────────────────────────────────────────

export function CreateType() {
    return (
        <div className="container mx-auto py-6">
            <CreateTypeBody pageMode />
        </div>
    );
}

export function EditType() {
    return (
        <div className="container mx-auto py-6">
            <UpdateTypeBody pageMode initialData={{} as any} />
        </div>
    );
}
