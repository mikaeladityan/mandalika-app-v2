/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/form/textarea.tsx
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

type PropsTextareaForm = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    className?: string;
    maxLength?: number; // Add new maxLength prop
};

export function TextareaForm({
    name,
    control,
    label,
    error,
    className,
    maxLength = 1000, // Set default maxLength to 1000
    ...props
}: React.ComponentProps<"textarea"> & PropsTextareaForm) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="w-full space-y-1">
                    {label && (
                        <label htmlFor={name} className="font-medium text-sm">
                            {label} {props.required && <sup className="text-red-500">*</sup>}
                        </label>
                    )}
                    <div className="relative">
                        <Textarea
                            {...field}
                            {...props}
                            id={name}
                            maxLength={maxLength} // Pass maxLength to the Textarea component
                            className={cn(
                                "min-h-25 border-gray-600 text-sm pr-12",
                                className,
                                error && "border-red-500",
                            )}
                        />
                        {/* Display character count */}
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {field.value?.length || 0}/{maxLength}
                        </div>
                    </div>
                    {error?.message && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                </div>
            )}
        />
    );
}
