"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import {
    RequestSizeDTO,
    RequestSizeSchema,
    ResponseSizeDTO,
} from "@/app/(application)/products/(component)/size/server/size.schema";
import { useActionSize } from "@/app/(application)/products/(component)/size/server/use.size";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Reusable Form Body ────────────────────────────────────────────────────

interface CreateSizeBodyProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function CreateSizeBody({ onSuccess, onCancel, pageMode = false }: CreateSizeBodyProps) {
    const { create } = useActionSize();
    const router = useRouter();
    const form = useForm<RequestSizeDTO>({
        resolver: zodResolver(RequestSizeSchema) as any,
        defaultValues: {
            size: undefined as any,
        },
    });

    const onSubmit = async (body: RequestSizeDTO) => {
        await create.mutateAsync(body);
        form.reset();
        onSuccess?.();
    };

    const Content = (
        <div className="grid grid-cols-1 gap-5">
            <InputForm
                control={form.control}
                disabled={create.isPending}
                name="size"
                label="Ukuran (Angka ML)"
                placeholder="Contoh: 30, 50, 100..."
                type="number"
                autoFocus
                error={form.formState.errors.size}
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
                Simpan Ukuran
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
                            <CardTitle className="text-xl font-bold">Tambah Ukuran Baru</CardTitle>
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

interface UpdateSizeBodyProps {
    initialData: ResponseSizeDTO;
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function UpdateSizeBody({
    initialData,
    onSuccess,
    onCancel,
    pageMode = false,
}: UpdateSizeBodyProps) {
    const { update } = useActionSize();
    const router = useRouter();
    const form = useForm<RequestSizeDTO>({
        resolver: zodResolver(RequestSizeSchema) as any,
        defaultValues: {
            size: initialData.size,
        },
    });

    const onSubmit = async (body: RequestSizeDTO) => {
        await update.mutateAsync({ id: initialData.id, body });
        onSuccess?.();
    };

    const Content = (
        <div className="grid grid-cols-1 gap-5">
            <InputForm
                control={form.control}
                disabled={update.isPending}
                name="size"
                label="Ukuran (Angka ML)"
                placeholder="Contoh: 30, 50, 100..."
                type="number"
                autoFocus
                error={form.formState.errors.size}
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
                Update Ukuran
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
                            <CardTitle className="text-xl font-bold">Update Ukuran</CardTitle>
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

export function CreateSize() {
    return (
        <div className="container mx-auto py-6">
            <CreateSizeBody pageMode />
        </div>
    );
}

export function EditSize() {
    return (
        <div className="container mx-auto py-6">
            <UpdateSizeBody pageMode initialData={{} as any} />
        </div>
    );
}
