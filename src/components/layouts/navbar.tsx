import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User, ChevronDown, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth, useFormAuth } from "@/app/auth/server/use.auth";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { isPathActive } from "./sidebar/utils";
import { useSidebarData } from "./sidebar/config";

export function Navbar() {
    const { account } = useAuth();
    const { logout, isPending } = useFormAuth();
    const pathname = usePathname();
    const sidebarData = useSidebarData();

    // 1. DYNAMIC BREADCRUMBS & LOGIC
    const getMetadata = () => {
        let workspace = "System Dashboard";
        let parent = "Dashboard";
        let child = "Shell Utama ERP";

        for (const group of sidebarData) {
            for (const item of group.items) {
                if (item.url && isPathActive(pathname, item.url)) {
                    workspace = `${group.label || "System"} Workspace`;
                    parent = group.label || "System";
                    child = item.title;
                    return { workspace, parent, child };
                }
                if (item.items) {
                    for (const sub of item.items) {
                        if (sub.url && isPathActive(pathname, sub.url)) {
                            workspace = `${group.label || "System"} Workspace`;
                            parent = item.title;
                            child = sub.title;
                            return { workspace, parent, child };
                        }
                        if (sub.items) {
                            for (const ssi of sub.items) {
                                if (ssi.url && isPathActive(pathname, ssi.url)) {
                                    workspace = `${group.label || "System"} Workspace`;
                                    parent = sub.title;
                                    child = ssi.title;
                                    return { workspace, parent, child };
                                }
                            }
                        }
                    }
                }
            }
        }
        return { workspace, parent, child };
    };

    const { workspace, parent, child } = getMetadata();

    // 2. DYNAMIC NEXT FLOW BUTTON
    const getNextFlow = () => {
        if (pathname === "/") {
            return { label: "Master Data", url: "/warehouses" };
        }
        if (
            pathname.startsWith("/warehouses") ||
            pathname.startsWith("/outlets") ||
            pathname.startsWith("/products") ||
            pathname.startsWith("/rawmat")
        ) {
            return { label: "Purchasing", url: "/purchase" };
        }
        if (pathname.startsWith("/purchase") || pathname.startsWith("/po")) {
            return { label: "Manufacturing", url: "/production" };
        }
        if (
            pathname.startsWith("/production") ||
            pathname.startsWith("/recipes") ||
            pathname.startsWith("/bom")
        ) {
            return { label: "Inventory", url: "/stock-transfers" };
        }
        if (pathname.startsWith("/stock-transfers") || pathname.startsWith("/stock-movements")) {
            return { label: "POS", url: "/sales" };
        }
        if (pathname.startsWith("/sales")) {
            return { label: "Finance", url: "/forecasts" };
        }
        if (pathname.startsWith("/forecasts") || pathname.startsWith("/recomendation")) {
            return { label: "Settings", url: "/settings" };
        }
        return { label: "Home", url: "/" };
    };

    const nextFlow = getNextFlow();

    const initials = account?.user
        ? `${account.user.first_name[0]}${account.user.last_name?.[0] ?? ""}`.toUpperCase()
        : (account?.email?.[0]?.toUpperCase() ?? "U");

    const displayName = account?.user
        ? `${account.user.first_name} ${account.user.last_name ?? ""}`.trim()
        : (account?.email ?? "");

    return (
        <nav className="flex items-center justify-between bg-white/88 backdrop-blur-md px-3 sm:px-5 h-[60px] border-b border-[#E2E8F0] sticky top-0 z-30 shadow-[0_8px_22px_rgba(15,23,42,0.05)] gap-2 overflow-hidden">
            {/* ── LEFT: Sidebar trigger + breadcrumb ── */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <SidebarTrigger className="hover:bg-primary/10 text-[#64748B] hover:text-primary transition-colors size-9 rounded-lg shrink-0" />
                <div className="flex flex-col gap-0.5 leading-none min-w-0">
                    <small className="hidden sm:block text-[10px] text-[#64748B] uppercase tracking-[0.12em] font-extrabold truncate">
                        {workspace}
                    </small>
                    <div className="flex items-center gap-1 text-[13px] sm:text-[14px] min-w-0">
                        <b className="hidden sm:block text-[#0F172A] font-light tracking-wide truncate max-w-[100px] lg:max-w-none">
                            {parent}
                        </b>
                        <span className="hidden sm:inline text-[#64748B]/40 -translate-y-px shrink-0">/</span>
                        <b className="text-[#0F172A] font-light tracking-wide truncate max-w-[130px] sm:max-w-[200px] lg:max-w-none">
                            {child}
                        </b>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Actions ── */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {/* Flow Navigation — lg+ only */}
                <div className="hidden lg:flex items-center gap-2 mr-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[11.5px] font-bold text-muted-foreground hover:text-primary transition-colors border border-transparent hover:border-border rounded-[10px]"
                        asChild
                    >
                        <Link href="/">Roadmap</Link>
                    </Button>
                    <Button
                        size="sm"
                        className="h-8 px-3 text-[11.5px] font-bold bg-[#D4AF37] hover:bg-[#B49020] text-white shadow-[0_10px_20px_rgba(212,175,55,0.2)] rounded-[10px] transition-all"
                        asChild
                    >
                        <Link href={nextFlow.url}>Next: {nextFlow.label}</Link>
                    </Button>
                </div>

                <div className="h-6 w-px bg-border/50 hidden lg:block" />

                {/* Bell */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground relative hover:bg-primary/10 hover:text-primary transition-colors size-8 sm:size-9"
                >
                    <Bell className="size-4 sm:size-5" />
                    <span className="absolute top-2 right-2 size-1.5 sm:size-2 bg-primary rounded-full border-2 border-white" />
                </Button>

                <div className="h-6 w-px bg-border/50" />

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 p-1 sm:p-1.5 rounded-lg hover:bg-primary/10 transition-all cursor-pointer outline-none group border border-transparent hover:border-primary/10">
                            <Avatar className="size-7 sm:size-8 rounded-lg shrink-0">
                                <AvatarFallback className="bg-sidebar text-primary text-xs font-black rounded-lg border border-primary/20 uppercase tracking-tighter">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {/* Name + role — hidden on mobile */}
                            <div className="hidden md:flex flex-col items-start text-left leading-tight">
                                <span className="text-xs max-w-[80px] lg:max-w-[120px] truncate font-medium text-foreground group-hover:text-primary transition-colors">
                                    {displayName}
                                </span>
                                {account?.role && (
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        {account.role}
                                    </span>
                                )}
                            </div>
                            <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors hidden md:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuLabel className="font-normal p-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold">{displayName}</p>
                                <p className="text-xs text-muted-foreground">{account?.email}</p>
                                {account?.role && (
                                    <Badge
                                        variant="secondary"
                                        className="mt-1 w-fit text-[10px] py-0 h-4"
                                    >
                                        {account.role}
                                    </Badge>
                                )}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-2.5 cursor-pointer">
                            <User className="mr-2 size-4 text-muted-foreground" />
                            <span>Profil Saya</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="p-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                            onClick={() => logout()}
                            disabled={isPending}
                        >
                            <LogOut className="mr-2 size-4" />
                            <span>Keluar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
