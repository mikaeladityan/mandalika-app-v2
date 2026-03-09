import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useDebounce<T>(value: T, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

export function useQueryParams() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const get = (key: string) => searchParams.get(key);

    const set = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === undefined || value === "") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const batchSet = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined) params.delete(key);
            else params.set(key, value);
        });

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return { get, set, batchSet, searchParams };
}
