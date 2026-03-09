import { cn } from "@/lib/utils";
import { Slider } from "../slider";
import { Controller } from "react-hook-form";
import * as SliderPrimitive from "@radix-ui/react-slider";

// Props untuk SliderForm
type SliderFormProps = {
    name: string;
    control?: any;
    label?: string;
    error?: { message?: string };
    description?: string;
    showValue?: boolean;
    required?: boolean;
    valueFormat?: (value: number) => string | number;
} & React.ComponentProps<typeof SliderPrimitive.Root>;

// Komponen SliderForm yang terintegrasi dengan react-hook-form
export function SliderForm({
    name,
    control,
    label,
    error,
    description,
    showValue = false,
    valueFormat = (value) => value,
    className,
    min = 0,
    max = 100,
    required = false,
    ...props
}: SliderFormProps) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={min}
            render={({ field }) => {
                // Parse nilai dari field untuk memastikan tipe number
                const fieldValue =
                    field.value !== undefined && field.value !== null ? Number(field.value) : min;

                // Handle jika field.value adalah array (untuk range)
                const isArrayValue = Array.isArray(field.value);
                const parsedValue = isArrayValue
                    ? field.value.map((v: any) => Number(v))
                    : fieldValue;

                // Format nilai untuk display
                const displayValue = isArrayValue
                    ? parsedValue.map((v: any) => String(valueFormat(v))).join(" - ")
                    : String(valueFormat(parsedValue));

                return (
                    <div className="w-full space-y-3">
                        {/* Label dan nilai saat ini */}
                        <div className="flex items-center justify-between">
                            {label && (
                                <label htmlFor={name} className="font-medium text-sm">
                                    {label} {required && <span className="text-red-500">*</span>}
                                </label>
                            )}

                            {showValue && (
                                <span className="text-sm text-muted-foreground font-medium">
                                    {displayValue}
                                </span>
                            )}
                        </div>

                        {/* Slider */}
                        <Slider
                            {...field}
                            {...props}
                            min={min}
                            max={max}
                            value={isArrayValue ? parsedValue : [parsedValue]}
                            onValueChange={(values) => {
                                // Jika props.onValueChange ada, panggil dulu
                                if (props.onValueChange) {
                                    props.onValueChange(values);
                                }

                                // Update field value dengan konversi ke number
                                const newValue = isArrayValue
                                    ? values.map((v) => Number(v))
                                    : Number(values[0]);

                                field.onChange(newValue);
                            }}
                            className={cn(error && "border-red-500", className)}
                            aria-describedby={error ? `${name}-error` : undefined}
                            aria-invalid={!!error}
                        />

                        {/* Deskripsi dan Error */}
                        <div className="min-h-5">
                            {description && !error && (
                                <p className="text-xs text-muted-foreground">{description}</p>
                            )}

                            {error?.message && (
                                <p
                                    id={`${name}-error`}
                                    className="text-red-500 text-xs mt-1"
                                    role="alert"
                                >
                                    {error.message}
                                </p>
                            )}
                        </div>

                        {/* Nilai min dan max */}
                        {/* <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{String(valueFormat(min))}</span>
                            <span>{String(valueFormat(max))}</span>
                        </div> */}
                    </div>
                );
            }}
        />
    );
}

// Versi khusus untuk range slider
export function RangeSliderForm({
    name,
    control,
    label,
    error,
    description,
    showValue = false,
    valueFormat = (value) => value,
    min = 0,
    max = 100,
    defaultValue = [min, max],
    required = false,
    ...props
}: SliderFormProps) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => {
                // Parse semua nilai ke number
                const fieldValue = Array.isArray(field.value)
                    ? field.value.map((v) => Number(v))
                    : defaultValue.map((v) => Number(v));

                const displayValue = fieldValue.map((v) => String(valueFormat(v))).join(" - ");

                return (
                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between">
                            {label && (
                                <label htmlFor={name} className="font-medium text-sm">
                                    {label} {required && <span className="text-red-500">*</span>}
                                </label>
                            )}

                            {showValue && (
                                <span className="text-sm text-muted-foreground font-medium">
                                    {displayValue}
                                </span>
                            )}
                        </div>

                        <Slider
                            {...field}
                            {...props}
                            min={min}
                            max={max}
                            value={fieldValue}
                            onValueChange={(values) => {
                                if (props.onValueChange) {
                                    props.onValueChange(values);
                                }
                                // Konversi ke number array
                                field.onChange(values.map((v) => Number(v)));
                            }}
                            className={cn(error && "border-red-500", props.className)}
                        />

                        <div className="min-h-5">
                            {description && !error && (
                                <p className="text-xs text-muted-foreground">{description}</p>
                            )}

                            {error?.message && (
                                <p className="text-red-500 text-xs mt-1">{error.message}</p>
                            )}
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{String(valueFormat(min))}</span>
                            <span>{String(valueFormat(max))}</span>
                        </div>
                    </div>
                );
            }}
        />
    );
}

// // Single value slider
// <SliderForm
//   name="volume"
//   control={control}
//   label="Volume"
//   min={0}
//   max={100}
//   step={1}
//   showValue={true}
//   valueFormat={(value) => `${value}%`}
//   description="Atur volume audio"
// />

// // Range slider
// <RangeSliderForm
//   name="priceRange"
//   control={control}
//   label="Rentang Harga"
//   min={0}
//   max={1000000}
//   step={10000}
//   defaultValue={[0, 500000]}
//   showValue={true}
//   valueFormat={(value) => `Rp ${value.toLocaleString()}`}
//   description="Pilih rentang harga yang diinginkan"
// />

// // Tanpa react-hook-form (standalone)
// <Slider
//   defaultValue={[50]}
//   max={100}
//   step={1}
//   className="w-full"
// />
