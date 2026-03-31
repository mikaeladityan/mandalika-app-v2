"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button, ButtonProps } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandInput,
    CommandEmpty,
    CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

export type Option = {
    value: string | number;
    label: string;
    description?: string; // Tambah ini untuk info detail di bawah label
    disabled?: boolean;
};

type SelectFormProps = {
    name: string;
    control?: any;
    label?: React.ReactNode; // Ubah ke ReactNode agar bisa template/string
    error?: { message?: string };
    description?: string;
    options?: Option[];
    className?: string;
    placeholder?: string;
    required?: boolean;
    isLoading?: boolean;
    canSearching?: boolean;
    onValueChange?: (value: string) => void;
};

export function SelectForm({
    name,
    control,
    label,
    error,
    description,
    options = [],
    placeholder = "Select an option",
    required = false,
    className,
    isLoading = false,
    canSearching = false,
    onValueChange,
}: SelectFormProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const [open, setOpen] = React.useState(false);
                const [search, setSearch] = React.useState("");

                React.useEffect(() => {
                    if (!open) setSearch("");
                }, [open]);

                const selectedLabel =
                    options.find((opt) => String(opt.value) === String(field.value))?.label ?? "";

                const filteredOptions = canSearching
                    ? options.filter((opt) =>
                          opt.label.toLowerCase().includes(search.toLowerCase()),
                      )
                    : options;

                return (
                    <div className={cn("w-full", className)}>
                        {label && (
                            <label className="text-sm font-medium flex items-center">
                                {label}
                                {required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}

                        <Popover open={open} onOpenChange={setOpen} modal={true}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    disabled={isLoading}
                                    className={cn(
                                        "w-full justify-between border-gray-600",
                                        error && "border-destructive",
                                    )}
                                >
                                    <span className="truncate">{selectedLabel || placeholder}</span>
                                    {isLoading ? (
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                    )}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="start"
                                side="bottom"
                                sideOffset={4}
                                className="w-full p-0 max-h-[min(320px,calc(100vh-120px))] overflow-hidden"
                                style={{
                                    width: "var(--radix-popover-trigger-width)",
                                }}
                            >
                                <Command shouldFilter={false} className="h-full">
                                    {canSearching && (
                                        <div className="sticky top-0 z-10 bg-popover">
                                            <CommandInput
                                                placeholder="Search..."
                                                value={search}
                                                onValueChange={setSearch}
                                                autoFocus
                                            />
                                        </div>
                                    )}

                                    <CommandList className="max-h-65 overflow-y-auto overscroll-contain">
                                        <CommandEmpty>No results found</CommandEmpty>

                                        <CommandGroup>
                                            {filteredOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    value={String(option.value)}
                                                    disabled={option.disabled}
                                                    onSelect={() => {
                                                        field.onChange(option.value);
                                                        onValueChange?.(String(option.value));
                                                        setOpen(false);
                                                    }}
                                                    className="flex flex-col items-start"
                                                >
                                                    <div className="flex items-center w-full">
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4 shrink-0",
                                                                String(field.value) ===
                                                                    String(option.value)
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                        <span className="font-medium">
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    {option.description && (
                                                        <span className="text-xs font-medium text-muted-foreground ml-6">
                                                            {option.description}
                                                        </span>
                                                    )}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {error?.message && <p className="text-xs text-red-500">{error.message}</p>}

                        {description && !error && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}

// ─── Standalone Filter Select (tanpa react-hook-form) ────────────────────────
type SelectFilterProps = {
    value?: string | number | null;
    onChange: (value: string | number) => void;
    onReset?: () => void;
    options?: Option[];
    placeholder?: string;
    className?: string;
    isLoading?: boolean;
    canSearching?: boolean;
    disabled?: boolean;
    size?: ButtonProps["size"];
};

export function SelectFilter({
    value,
    onChange,
    onReset,
    options = [],
    placeholder = "Select an option",
    className,
    isLoading = false,
    canSearching = false,
    disabled = false,
    size,
}: SelectFilterProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        if (!open) setSearch("");
    }, [open]);

    const selectedOption = options.find((opt) => String(opt.value) === String(value));
    const selectedLabel = selectedOption?.label ?? "";

    const filteredOptions = canSearching
        ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
        : options;

    const isActive = value !== undefined && value !== null && value !== "";

    return (
        <div className={cn("relative", className)}>
            <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        size={size}
                        variant={isActive ? "default" : "outline"}
                        role="combobox"
                        aria-expanded={open}
                        disabled={isLoading || disabled}
                        className={cn("w-full justify-between")}
                    >
                        <span className="truncate">{selectedLabel || placeholder}</span>
                        <div className="flex items-center shrink-0 ml-2">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isActive && onReset ? (
                                <X
                                    className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onReset();
                                        setOpen(false);
                                    }}
                                />
                            ) : (
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    className="w-full p-0 max-h-[min(320px,calc(100vh-120px))] overflow-hidden"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                >
                    <Command shouldFilter={false} className="h-full">
                        {canSearching && (
                            <div className="sticky top-0 z-10 bg-popover">
                                <CommandInput
                                    placeholder="Cari..."
                                    value={search}
                                    onValueChange={setSearch}
                                    autoFocus
                                />
                            </div>
                        )}

                        <CommandList className="max-h-65 overflow-y-auto overscroll-contain">
                            <CommandEmpty>Tidak ada hasil</CommandEmpty>

                            <CommandGroup>
                                {isActive && onReset && (
                                    <CommandItem
                                        onSelect={() => {
                                            onReset();
                                            setOpen(false);
                                        }}
                                        className="text-muted-foreground italic flex border-b rounded-none mb-1"
                                    >
                                        Hapus Filter...
                                    </CommandItem>
                                )}
                                {filteredOptions.length === 0 && !isActive && (
                                    <div className="py-6 text-center text-sm">Tidak ada opsi</div>
                                )}
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={String(option.value)}
                                        disabled={option.disabled}
                                        onSelect={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                        className="flex flex-col items-start"
                                    >
                                        <div className="flex items-center w-full">
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4 shrink-0",
                                                    String(value) === String(option.value)
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                            <span className="font-medium">{option.label}</span>
                                        </div>
                                        {option.description && (
                                            <span className="text-xs font-medium text-muted-foreground ml-6">
                                                {option.description}
                                            </span>
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
