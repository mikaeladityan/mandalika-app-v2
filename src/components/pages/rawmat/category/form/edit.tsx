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
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function EditCategory() {
    const { id } = useParams();
    const { account } = useAuth();
    const { update } = useFormCategory(Number(id));
    const { category } = useCategory(undefined, Number(id));
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
        form.reset();
    };

    const statusOption: Option[] = STATUS.map((status) => ({
        value: status,
        label: status.charAt(0) + status.slice(1).toLowerCase(),
    }));

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
                            Edit Raw Material: {category.data?.name}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-5">
                        <InputForm
                            control={form.control}
                            disabled={update.isPending}
                            name="name"
                            label="Nama Kategori"
                            placeholder="Kategori..."
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
                    {account?.role !== "MEMBER" && (
                        <CardContent>
                            <SelectForm
                                name="status"
                                control={form.control}
                                isLoading={update.isPending}
                                error={form.formState.errors.status}
                                options={statusOption}
                            />
                        </CardContent>
                    )}
                    <CardFooter>
                        <Button className="w-full" disabled={update.isPending} variant="teal">
                            {update.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                            Simpan
                        </Button>
                    </CardFooter>
                </Card>
            </Form>
        </>
    );
}
