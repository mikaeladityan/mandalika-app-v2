/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "../checkbox";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

type PropsCheckboxForm = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    disabled?: boolean;
    className?: string;
};

export function CheckboxForm({
    name,
    control,
    label,
    error,
    disabled,
    className,
}: PropsCheckboxForm) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                            className={cn(error && "border-red-500")}
                        />
                        {label && (
                            <label
                                htmlFor={name}
                                className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                    className
                                )}
                            >
                                {label}
                            </label>
                        )}
                    </div>
                    {error?.message && (
                        <p className="text-red-500 text-xs mt-1">{error.message}</p>
                    )}
                </div>
            )}
        />
    );
}
