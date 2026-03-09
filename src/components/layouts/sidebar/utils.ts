import { SidebarItemConfig } from "./config";

export function isPathActive(pathname: string, target: string) {
    if (target === "/") return pathname === "/";
    return pathname.startsWith(target);
}
