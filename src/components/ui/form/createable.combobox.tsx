// src/components/ui/form/creatable-combobox.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useController, FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader, Loader2, Plus } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { SetStateAction } from "jotai";

type EnhancedCreatableComboboxProps = {
    name: string; // Hanya satu field name yang dibutuhkan
    label?: string;
    placeholder?: string;
    options: { value: string; label: string; id?: number }[];
    isLoading?: boolean;
    isError?: boolean;
    refetch?: () => void;
    className?: string;
    setSelectedId?: React.Dispatch<SetStateAction<number | null>>;
    required?: boolean;
    /** Callback ketika user mengetik di search input — untuk server-side search */
    onSearchChange?: (value: string) => void;
};

export function EnhancedCreatableCombobox({
    name,
    label,
    placeholder = "Pilih atau buat baru",
    options,
    isLoading = false,
    isError = false,
    refetch,
    className,
    setSelectedId,
    required = false,
    onSearchChange,
}: EnhancedCreatableComboboxProps) {
    const { field, fieldState } = useController({ name });
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const error = fieldState.error as FieldError | undefined;

    useEffect(() => {
        if (!open) {
            setSearchValue("");
            onSearchChange?.("");
        }
    }, [open]);

    const displayValue = field.value
        ? options.find(
              (option) => String(option.value).toLowerCase() === String(field.value).toLowerCase(),
          )?.label || field.value
        : "";

    const handleSelect = (value: string, id?: number) => {
        if (setSelectedId) {
            setSelectedId(Number(id));
            field.onChange(value);
            setOpen(false);
        } else {
            field.onChange(value);
            setOpen(false);
        }
    };

    const handleCreate = () => {
        if (searchValue.trim()) {
            field.onChange(searchValue.trim());
            setOpen(false);
            if (setSelectedId) {
                setSelectedId(null);
            }
        }
    };

    const hasMatchingOption = options.some((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
        <div className={cn("w-full space-y-1", className)}>
            {label && (
                <label className="font-medium text-sm">
                    {label} {required && <span className="text-sm text-red-500">*</span>}
                </label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={isLoading} // Menambahkan properti disabled saat isLoading
                        className="w-full justify-between border-gray-600"
                    >
                        <span className="truncate">
                            {displayValue || (
                                <div className="flex items-center justify-start gap-2">
                                    {isLoading && <Loader2 className="animate-spin" />}
                                    {placeholder}
                                </div>
                            )}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-full p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Cari atau buat baru..."
                            value={searchValue}
                            onValueChange={(val) => {
                                setSearchValue(val);
                                onSearchChange?.(val);
                            }}
                        />
                        {searchValue && !hasMatchingOption && (
                            <CommandGroup>
                                <CommandItem value={searchValue} onSelect={handleCreate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat baru: {searchValue}
                                </CommandItem>
                            </CommandGroup>
                        )}
                        {options.length > 0 && (
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        className="capitalize"
                                        onSelect={() => handleSelect(option.value, option.id)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === option.value
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        <CommandEmpty>
                            <div className="flex flex-col gap-2 py-2 px-4">
                                {isError && refetch && (
                                    <button
                                        type="button"
                                        className="text-red-500 hover:underline"
                                        onClick={() => refetch()}
                                    >
                                        Gagal memuat data. Coba lagi?
                                    </button>
                                )}
                                {!searchValue && !isError && !isLoading && (
                                    <div className="text-gray-500">
                                        Ketik untuk mencari atau membuat baru
                                    </div>
                                )}
                            </div>
                        </CommandEmpty>
                        {isLoading && (
                            <div className="py-4 px-4">
                                <Skeleton className="h-8 w-full mb-2" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
            {error?.message && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
