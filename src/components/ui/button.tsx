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
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                // Default variant (primary color)
                default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",

                // Destructive variant (red for dangerous actions)
                destructive:
                    "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",

                // Outline variant (border and transparent background)
                outline:
                    "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",

                // Secondary variant
                secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",

                // Ghost variant (no background, only hover effect)
                ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",

                // Link variant (underlined text)
                link: "text-primary underline-offset-4 hover:underline",

                // --- NEW VARIANTS ---

                // Success variant (green, for successful actions)
                success: "bg-green-600 text-white shadow-xs hover:bg-green-500",

                // Info variant (sky, for informational actions)
                info: "bg-sky-600 text-white shadow-xs hover:bg-sky-500",

                // Warning variant (amber, for warning actions)
                warning: "bg-amber-600 text-white shadow-xs hover:bg-amber-500",

                // Teal variant (for a different shade of blue/green)
                teal: "bg-teal-600 text-white shadow-xs hover:bg-teal-500",

                // Rose variant (for a soft, pinkish color)
                rose: "bg-rose-600 text-white shadow-xs hover:bg-rose-500",
            },
            size: {
                // Extra Small
                xs: "h-7 rounded-md gap-1 px-3 has-[>svg]:px-2 text-xs",

                // Default size
                default: "h-9 px-4 py-2 has-[>svg]:px-3",

                // Small size
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",

                // Large size
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",

                // Icon size (square button)
                icon: "size-9",
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
