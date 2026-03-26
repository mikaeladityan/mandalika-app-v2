/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormProps {
    children: React.ReactNode;
    methods: UseFormReturn<any>;
    className?: string;
    onSubmit?: (e: React.FormEvent) => void;
}

export const Form = ({ children, methods, className, onSubmit, ...rest }: FormProps) => {
    return (
        <FormProvider {...methods}>
            <form {...rest} onSubmit={onSubmit} className={cn(className)}>
                {children}
            </form>
        </FormProvider>
    );
};
