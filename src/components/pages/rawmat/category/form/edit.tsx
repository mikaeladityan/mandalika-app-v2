"use client";
import {
    RequestRawMatCategoryDTO,
    RequestRawMatCategorySchema,
} from "@/app/(application)/rawmat/(component)/categories/server/category.schema";
import {
    useCategory,
    useFormCategory,
} from "@/app/(application)/rawmat/(component)/categories/server/use.category";
import { useAuth } from "@/app/auth/server/use.auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "@/components/ui/form/input";
import { Form } from "@/components/ui/form/main";
import { Option, SelectForm } from "@/components/ui/form/select";
import { STATUS } from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, RefreshCcw, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

interface EditCategoryBodyProps {
    id?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
    pageMode?: boolean;
}

export function EditCategoryBody({
    id: propId,
    onSuccess,
    onCancel,
    pageMode = false,
}: EditCategoryBodyProps) {
    const params = useParams();
    const id = propId ?? Number(params.id);
    const { account } = useAuth();
    const { update } = useFormCategory(id);
    const { category } = useCategory(undefined, id);
    const router = useRouter();

    const form = useForm<Partial<RequestRawMatCategoryDTO>>({
        resolver: zodResolver(RequestRawMatCategorySchema.partial()),
        defaultValues: {
            name: "",
            status: "ACTIVE",
        },
    });

    useEffect(() => {
        if (!category.data) return;

        form.reset({
            name: category.data?.name ?? "",
            status: category.data?.status ?? "PENDING",
        });
    }, [category.data, form]);

    const onSubmit = async (body: Partial<RequestRawMatCategoryDTO>) => {
        await update.mutateAsync(body);
        if (onSuccess) {
            onSuccess();
        } else {
            router.push("/rawmat/categories");
        }
    };

    const statusOption: Option[] = STATUS.map((status) => ({
        value: status,
        label: status.charAt(0) + status.slice(1).toLowerCase(),
    }));

    if (category.isLoading) {
        return (
            <div className="p-8 text-center text-muted-foreground animate-pulse">
                Loading data...
            </div>
        );
    }

    const Content = (
        <div className="grid grid-cols-1 gap-5">
            <InputForm
                control={form.control}
                disabled={update.isPending}
                name="name"
                label="Nama Kategori"
                placeholder="Ketik nama kategori..."
                type="text"
                error={form.formState.errors.name}
            />
            {account?.role !== "STAFF" && (
                <SelectForm
                    name="status"
                    label="Status"
                    control={form.control}
                    isLoading={update.isPending}
                    error={form.formState.errors.status}
                    options={statusOption}
                />
            )}
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
                                Edit Kategori: {category.data?.name}
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

export function EditCategory() {
    return (
        <div className="container mx-auto py-6">
            <EditCategoryBody pageMode />
        </div>
    );
}
