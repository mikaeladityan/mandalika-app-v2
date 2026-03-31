"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerFormProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: { message?: string };
  className?: string;
}

export function DatePickerForm({
  name,
  control,
  label,
  placeholder = "Pilih tanggal",
  description,
  required,
  disabled,
  error,
  className,
}: DatePickerFormProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn("flex flex-col gap-1.5 w-full", className)}>
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-600 h-10",
                  !field.value && "text-muted-foreground",
                  error && "border-destructive",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value), "PPP")
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Simpan dalam format string YYYY-MM-DD untuk kompatibilitas form
                    field.onChange(format(date, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && (
            <p className="text-[0.8rem] text-muted-foreground">{description}</p>
          )}
          {error?.message && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
