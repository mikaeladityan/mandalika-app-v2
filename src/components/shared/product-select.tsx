"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProductsQuery } from "@/app/(application)/products/server/use.products";

interface ProductSelectProps {
    onSelect: (product: any) => void;
    placeholder?: string;
    className?: string;
}

export function ProductSelect({
    onSelect,
    placeholder = "Cari produk...",
    className,
}: ProductSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const { data: products, isLoading } = useProductsQuery({
        search: search || undefined,
        status: "ACTIVE",
        sortBy: "name",
        sortOrder: "asc",
        take: 10,
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between rounded-xl border-slate-200 bg-white shadow-none hover:bg-slate-50",
                        className,
                    )}
                >
                    <div className="flex items-center gap-2 truncate text-muted-foreground font-medium">
                        <Search className="h-4 w-4 opacity-50" />
                        {placeholder}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[500px] p-0 border-none shadow-2xl rounded-2xl overflow-hidden"
                align="start"
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Ketik nama atau kode produk..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList className="max-h-[300px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        ) : products?.length === 0 ? (
                            <CommandEmpty>Produk tidak ditemukan.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {products?.map((product: any) => (
                                    <CommandItem
                                        key={product.id}
                                        value={product.id.toString()}
                                        onSelect={() => {
                                            onSelect(product);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        className="flex flex-col items-start px-4 py-3 cursor-pointer hover:bg-primary/5"
                                    >
                                        <div className="flex flex-col w-full gap-1">
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-bold text-sm text-slate-700">
                                                    {product.name}{" "}
                                                    {product.product_type && (
                                                        <span className="text-[10px] text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tight">
                                                            {product.product_type.name}
                                                        </span>
                                                    )}
                                                    {product.size && (
                                                        <span className="text-[10px] text-muted-foreground font-medium border-l pl-2 border-slate-200 leading-none uppercase">
                                                            {product.size.size}
                                                            {product.unit && product.unit.name}
                                                        </span>
                                                    )}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] font-mono bg-slate-50 text-slate-500 border-slate-200"
                                                >
                                                    {product.code}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

import { Badge } from "@/components/ui/badge";
