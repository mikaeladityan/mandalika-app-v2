"use client";
import { useState } from "react";
import { Button } from "./ui/button";

export function LogData<T>({ data }: { data: T }) {
    const [open, setOpen] = useState(true);

    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        return (
            <div className="mt-5">
                <Button size={"sm"} onClick={() => setOpen(!open)}>
                    Console.log
                </Button>

                {open && (
                    <pre className="mt-5 text-xs text-gray-600 text-wrap w-fit">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                )}
            </div>
        );
    }
}
