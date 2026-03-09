import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

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
        <button
            type="button"
            onClick={() => onSort(sortKey)}
            className="flex items-center gap-1 font-medium hover:text-primary cursor-pointer"
        >
            {label}
            {!isActive && <ArrowUpDown size={14} />}
            {isActive && activeSortOrder === "asc" && <ArrowUp size={14} />}
            {isActive && activeSortOrder === "desc" && <ArrowDown size={14} />}
        </button>
    );
}
