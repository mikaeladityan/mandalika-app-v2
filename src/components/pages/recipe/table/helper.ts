import { ResponseRecipeDTO } from "@/app/(application)/recipes/server/recipe.schema";

export type RecipeGroupedRow =
    | {
          type: "product";
          product: NonNullable<ResponseRecipeDTO["product"]>;
      }
    | ({
          type: "item";
      } & ResponseRecipeDTO);

export function groupRecipeRows(data: ResponseRecipeDTO[]): RecipeGroupedRow[] {
    const map = new Map<number, RecipeGroupedRow[]>();

    data.forEach((row) => {
        if (!row.product) return;

        const pid = row.product.id;

        if (!map.has(pid)) {
            map.set(pid, [
                {
                    type: "product",
                    product: row.product,
                },
            ]);
        }

        map.get(pid)!.push({
            type: "item",
            ...row,
        });
    });

    return Array.from(map.values()).flat();
}
export function getStockAlert(stock?: number) {
    if (stock === undefined) return null;
    if (stock <= 5) return "danger";
    if (stock <= 10) return "warning";
    return null;
}
