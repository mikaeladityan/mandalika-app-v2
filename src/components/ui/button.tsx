import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/index";

/**
 * A utility function to conditionally join Tailwind CSS class names.
 * This is a simple, self-contained implementation to replace an external library.
 * It filters out falsy values and joins the remaining strings.
 */

/**
 * Defines the button styles and variants using `cva` (Class Variance Authority).
 * This allows for easy creation of different button types by combining variants like `variant` and `size`.
 */
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
                outline:
                    "border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                success: "bg-green-600 text-white shadow-xs hover:bg-green-500",
                info: "bg-sky-600 text-white shadow-xs hover:bg-sky-500",
                warning: "bg-amber-600 text-white shadow-xs hover:bg-amber-500",
                teal: "bg-teal-600 text-white shadow-xs hover:bg-teal-500",
                rose: "bg-rose-600 text-white shadow-xs hover:bg-rose-500",
            },
            size: {
                xs: "h-7 px-2.5 text-xs",
                sm: "h-8 px-3 text-xs",
                default: "h-10 px-4 py-2",
                lg: "h-11 px-8 text-base",
                icon: "size-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

/**
 * Type definition for the Button component props.
 * This includes native button attributes, cva variants, and the `asChild` prop.
 */
export interface ButtonProps
    extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

/**
 * The main Button component. It's a reusable component that uses Radix's `Slot`
 * and `cva` to create flexible and styled buttons.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
