import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "../button";

type SortableHeaderProps = {
    label: string;
    sortKey: string;
    activeSortBy?: string;
    activeSortOrder?: "asc" | "desc";
    onSort: (key: string) => void;
};

export function SortableHeader({
    label,
    sortKey,
    activeSortBy,
    activeSortOrder,
    onSort,
}: SortableHeaderProps) {
    const isActive = activeSortBy === sortKey;

    return (
        <Button
            type="button"
            onClick={() => onSort(sortKey)}
            className="flex items-center gap-1 font-bold hover:text-primary text-[10px] cursor-pointer hover:border-primary"
            variant="ghost"
            size="xs"
        >
            {label}
            {!isActive && <ArrowUpDown className="size-4 font-bold" />}
            {isActive && activeSortOrder === "asc" && <ArrowUp className="size-4 font-bold" />}
            {isActive && activeSortOrder === "desc" && <ArrowDown className="size-4 font-bold" />}
        </Button>
    );
}
