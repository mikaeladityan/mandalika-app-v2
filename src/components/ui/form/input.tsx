/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/form/input.tsx
import { Input } from "../input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Controller } from "react-hook-form";

type PropsInputForm = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    showVisibilityToggle?: boolean;
    onToggleVisibility?: () => void;
    isVisible?: boolean;
};

export function InputForm({
    name,
    control,
    label,
    error,
    className,
    showVisibilityToggle = false,
    onToggleVisibility,
    isVisible,
    ...props
}: React.ComponentProps<"input"> & PropsInputForm) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="w-full space-y-1">
                    <label htmlFor={name} className="font-medium text-sm">
                        {label || name} {props.required && <span className="text-red-500">*</span>}
                    </label>

                    <div className="relative">
                        <Input
                            {...field}
                            {...props}
                            id={name}
                            className={cn(
                                "border-gray-600 pr-10",
                                className,
                                error && "border-red-500"
                            )}
                        />

                        {showVisibilityToggle && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={onToggleVisibility}
                            >
                                {isVisible ? (
                                    <EyeOff size={18} aria-label="Sembunyikan password" />
                                ) : (
                                    <Eye size={18} aria-label="Tampilkan password" />
                                )}
                            </button>
                        )}
                    </div>

                    {error?.message && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                </div>
            )}
        />
    );
}
