import { ColumnDef } from "@tanstack/react-table";

/**
 * Utility function to convert RowSelectionState to array of selected IDs
 */
export function getSelectedIds(
    rowSelection: import("@tanstack/react-table").RowSelectionState,
): string[] {
    return Object.keys(rowSelection).filter((key) => rowSelection[key]);
}

/**
 * Utility function to handle export of selected table rows to CSV.
 *
 * @param filename - The name of the downloaded file (e.g. 'export.csv')
 * @param data - The original data array passed to the table
 * @param columns - The columns definition of the table
 * @param selectedIds - The array of selected IDs
 * @param getRowId - Function to get the ID from a data row
 */
export function exportToCSV<TData, TValue>(
    filename: string,
    data: TData[],
    columns: ColumnDef<TData, TValue>[],
    selectedIds: string[],
    getRowId: (row: TData) => string,
) {
    if (!selectedIds || selectedIds.length === 0) return;

    // 1. Filter only selected data
    const selectedData = data.filter((row) => selectedIds.includes(String(getRowId(row))));
    if (selectedData.length === 0) return;

    // 2. Filter out columns that don't have an accessorKey or are strictly for actions/select
    const exportableColumns = columns.filter(
        (col: any) =>
            (col.accessorKey || col.accessorFn) && col.id !== "select" && col.id !== "actions",
    );

    // 3. Generate headers iteratively
    const headers = exportableColumns.map((col: any) => {
        // use header string if possible, fallback to accessorKey or id
        return typeof col.header === "string" ? col.header : col.accessorKey || col.id || "Column";
    });

    // 4. Generate rows
    const rows = selectedData.map((row) => {
        return exportableColumns
            .map((col: any) => {
                let val: any = null;
                if (col.accessorKey) {
                    val = col.accessorKey
                        .split(".")
                        .reduce((acc: any, part: string) => acc && acc[part], row);
                } else if (col.accessorFn) {
                    try {
                        val = col.accessorFn(row);
                    } catch (e) {
                        val = null;
                    }
                }
                const strVal = val === null || val === undefined ? "" : String(val);
                // Escape quotes for CSV
                return `"${strVal.replace(/"/g, '""')}"`;
            })
            .join(",");
    });

    // 5. Build CSV content and trigger download
    // Add BOM for Excel UTF-8 display compatibility correctly
    const csvContent = [
        "\uFEFF" + headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
        ...rows,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/*
 * =========================================================================
 * CONTOH PENGGUNAAN (EXAMPLE USAGE)
 * =========================================================================
 *
 * import { useState } from "react";
 * import { DataTable } from "@/components/ui/table/data";
 * import { exportToCSV, getSelectedIds } from "@/components/ui/table/export";
 * import { Button } from "@/components/ui/button";
 * import { RowSelectionState } from "@tanstack/react-table";
 *
 * export function MyPage() {
 *     const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
 *
 *     // Data dari API (atau local state)
 *     const data = [...];
 *     const columns = [...];
 *
 *     // Array dari IDs yang terpilih
 *     const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
 *
 *     const handleExport = () => {
 *         exportToCSV(
 *             "data-export.csv",
 *             data,
 *             columns,
 *             selectedIds,
 *             (row) => row.id // Sesuaikan dengan key ID data Anda
 *         );
 *     };
 *
 *     const handleClearSelection = () => {
 *         setRowSelection({}); // Clear all selection
 *     };
 *
 *     return (
 *         <div>
 *             {selectedIds.length > 0 && (
 *                 <div className="flex gap-2 mb-4">
 *                     <Button onClick={handleExport}>
 *                         Export Terpilih ({selectedIds.length})
 *                     </Button>
 *                     <Button variant="outline" onClick={handleClearSelection}>
 *                         Clear Selection
 *                     </Button>
 *                 </div>
 *             )}
 *
 *             <DataTable
 *                 columns={columns}
 *                 data={data}
 *                 // Prop untuk mengaktifkan Multi-select
 *                 enableMultiSelect={true}
 *                 rowSelection={rowSelection}
 *                 onRowSelectionChange={setRowSelection}
 *                 getRowId={(row) => row.id} // Sesuaikan dengan key ID data Anda
 *                 // ... props pagination existing ...
 *             />
 *         </div>
 *     );
 * }
 */
