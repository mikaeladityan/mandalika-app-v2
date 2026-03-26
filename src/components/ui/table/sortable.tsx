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
            className="flex items-center gap-1 font-medium hover:text-primary cursor-pointer hover:border-primary"
            variant="ghost"
            size="sm"
        >
            {label}
            {!isActive && <ArrowUpDown size={14} />}
            {isActive && activeSortOrder === "asc" && <ArrowUp size={14} />}
            {isActive && activeSortOrder === "desc" && <ArrowDown size={14} />}
        </Button>
    );
}
