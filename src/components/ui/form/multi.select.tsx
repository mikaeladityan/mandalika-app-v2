"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandInput,
    CommandEmpty,
    CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type Option = {
    value: string | number;
    label: string;
    description?: string;
    disabled?: boolean;
};

type MultiSelectFormProps = {
    name: string;
    control?: any;
    label?: React.ReactNode;
    error?: { message?: string };
    description?: string;
    options?: Option[];
    className?: string;
    placeholder?: string;
    required?: boolean;
    isLoading?: boolean;
    canSearching?: boolean;
};

export function MultiSelectForm({
    name,
    control,
    label,
    error,
    description,
    options = [],
    placeholder = "Pilih opsi...",
    required = false,
    className,
    isLoading = false,
    canSearching = true,
}: MultiSelectFormProps) {
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

                const selectedValues: (string | number)[] = Array.isArray(field.value)
                    ? field.value
                    : [];

                const handleSelect = (value: string | number) => {
                    const isSelected = selectedValues.some((v) => String(v) === String(value));
                    if (isSelected) {
                        field.onChange(selectedValues.filter((v) => String(v) !== String(value)));
                    } else {
                        field.onChange([...selectedValues, value]);
                    }
                };

                const handleRemove = (e: React.MouseEvent, value: string | number) => {
                    e.stopPropagation();
                    field.onChange(selectedValues.filter((v) => String(v) !== String(value)));
                };

                const filteredOptions = canSearching
                    ? options.filter((opt) =>
                          opt.label.toLowerCase().includes(search.toLowerCase()),
                      )
                    : options;

                return (
                    <div className={cn("w-full space-y-1", className)}>
                        {label && (
                            <label className="text-sm font-medium flex items-center mb-1.5">
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
                                        "w-full justify-between items-center min-h-[40px] h-auto px-3 border-gray-600 font-normal hover:bg-transparent",
                                        error &&
                                            "border-destructive focus-visible:ring-destructive",
                                    )}
                                >
                                    <div className="flex flex-wrap items-center gap-1.5 w-full mr-4 pr-1">
                                        {selectedValues.length > 0 ? (
                                            selectedValues.map((val) => {
                                                const opt = options.find(
                                                    (o) => String(o.value) === String(val),
                                                );
                                                return (
                                                    <Badge
                                                        variant="secondary"
                                                        key={val}
                                                        className="px-2 py-0.5 rounded-sm font-medium truncate max-w-[150px] bg-slate-100/80 hover:bg-slate-200"
                                                    >
                                                        <span className="truncate">
                                                            {opt?.label ?? val}
                                                        </span>
                                                        <span
                                                            role="button"
                                                            className="ml-1 opacity-60 hover:opacity-100 shrink-0 cursor-pointer"
                                                            onClick={(e) => handleRemove(e, val)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </span>
                                                    </Badge>
                                                );
                                            })
                                        ) : (
                                            <span className="text-muted-foreground mr-auto">
                                                {placeholder}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center absolute right-3 shrink-0">
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                                        )}
                                    </div>
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
                                                placeholder="Cari..."
                                                value={search}
                                                onValueChange={setSearch}
                                                autoFocus
                                            />
                                        </div>
                                    )}

                                    <CommandList className="max-h-65 overflow-y-auto overscroll-contain">
                                        <CommandEmpty>No results found</CommandEmpty>

                                        <CommandGroup>
                                            {filteredOptions.length === 0 && !canSearching && (
                                                <div className="py-6 text-center text-sm">
                                                    Tidak ada opsi
                                                </div>
                                            )}
                                            {filteredOptions.map((option) => {
                                                const isSelected = selectedValues.some(
                                                    (v) => String(v) === String(option.value),
                                                );
                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={String(option.value)}
                                                        disabled={option.disabled}
                                                        onSelect={() => handleSelect(option.value)}
                                                        className="flex flex-col items-start cursor-pointer hover:bg-slate-50"
                                                    >
                                                        <div className="flex items-center w-full">
                                                            <div
                                                                className={cn(
                                                                    "mr-2 h-4 w-4 flex items-center justify-center rounded-sm border shrink-0 transition-all",
                                                                    isSelected
                                                                        ? "bg-primary border-primary text-primary-foreground"
                                                                        : "border-slate-300 opacity-50",
                                                                )}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="h-3 w-3 shrink-0" />
                                                                )}
                                                            </div>
                                                            <span className="font-medium text-[13px]">
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                        {option.description && (
                                                            <span className="text-[11px] font-medium text-muted-foreground ml-6 mt-0.5 max-w-[85%] truncate">
                                                                {option.description}
                                                            </span>
                                                        )}
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {error?.message && (
                            <p className="text-xs text-red-500 mt-1.5">{error.message}</p>
                        )}

                        {description && !error && (
                            <p className="text-[11.5px] text-muted-foreground mt-1.5 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
}
