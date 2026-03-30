export function isPathActive(pathname: string, target: string) {
    if (target === "/") return pathname === "/";

    // Exact match
    if (pathname === target) return true;

    // Query param boundaries
    if (pathname.startsWith(target + "?")) return true;

    // Sub-route inheritance logic
    if (pathname.startsWith(target + "/")) {
        const subRoute = pathname.slice(target.length + 1);
        const segment = subRoute.split("/")[0];

        // Prevent known sibling sub-modules from falsely highlighting their parent
        const blockedSubmodules = [
            "stocks",
            "stock-locations",
            "import",
            "type",
            "size",
            "unit",
            "suppliers",
            "categories",
            "units",
            "rekap",
            "analytics",
            "display",
            "percentages",
            "ffo",
            "fp-inter",
            "fp-local",
            "open",
        ];

        if (blockedSubmodules.includes(segment)) {
            return false;
        }

        // Allow 'create', 'edit', UUIDs, etc.
        return true;
    }

    return false;
}
