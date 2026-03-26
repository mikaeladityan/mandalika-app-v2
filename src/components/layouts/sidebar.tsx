import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronDown, LogOut, Loader2, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth, useFormAuth } from "@/app/auth/server/use.auth";
import { isPathActive } from "./sidebar/utils";
import { useSidebarData, SidebarItemConfig } from "./sidebar/config";
import { HeaderLogo } from "./sidebar/header";

function CollapsibleMenuSubItem({ item, pathname }: { item: SidebarItemConfig; pathname: string }) {
    const isActive =
        item.items?.some(
            (subSubItem) => subSubItem.url && isPathActive(pathname, subSubItem.url),
        ) ?? false;
    const [open, setOpen] = useState(isActive);

    useEffect(() => {
        if (isActive) setOpen(true);
    }, [pathname, isActive]);

    return (
        <Collapsible defaultOpen={isActive} open={open} onOpenChange={setOpen}>
            <SidebarMenuSubItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={open}
                        className={cn(
                            "w-full px-[13px] py-[10px] rounded-[12px] text-[13px] font-semibold text-zinc-400 border border-transparent transition-all duration-200 ease-out flex items-center gap-3",
                            "hover:bg-white/5 hover:text-white hover:translate-x-[2px] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
                            open &&
                                "bg-linear-to-r from-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.08)] text-[#F6D365] shadow-[inset_2px_0_0_#D4AF37,0_10px_22px_rgba(15,23,42,0.16)] font-bold",
                        )}
                    >
                        {item.icon && <item.icon className="h-4 w-4 shrink-0 transition-colors" />}
                        <span className="truncate flex-1 tracking-wide">{item.title}</span>
                        <ChevronDown
                            className={cn(
                                "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                                open ? "rotate-180 text-zinc-300" : "text-zinc-600",
                            )}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="ml-2 mr-2 mt-1 mb-2 p-2 border-l-2 border-[#D4AF37]/10 bg-linear-to-b from-white/5 to-transparent rounded-r-[12px] space-y-1">
                        {item.items?.map((subSubItem, idx) => {
                            const isSubActive = subSubItem.url
                                ? isPathActive(pathname, subSubItem.url)
                                : false;

                            return (
                                <SidebarMenuButton
                                    key={idx}
                                    asChild
                                    isActive={isSubActive}
                                    className={cn(
                                        "w-full px-[16px] py-[6px] rounded-[9px] text-[12px] font-medium text-zinc-500 transition-all duration-200 ease-out flex items-center gap-2.5 border border-transparent",
                                        "hover:bg-white/5 hover:text-white hover:translate-x-[2px] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
                                        isSubActive &&
                                            "bg-linear-to-r from-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.08)] text-[#F6D365] shadow-[inset_2px_0_0_#D4AF37,0_10px_22px_rgba(15,23,42,0.16)] font-bold",
                                    )}
                                >
                                    {subSubItem.url ? (
                                        <Link
                                            href={subSubItem.url}
                                            className="flex items-center gap-2.5 w-full"
                                        >
                                            {subSubItem.icon && (
                                                <subSubItem.icon className="h-3.5 w-3.5 shrink-0" />
                                            )}
                                            <span className="truncate">{subSubItem.title}</span>
                                        </Link>
                                    ) : (
                                        <span className="flex items-center gap-2.5 w-full">
                                            {subSubItem.icon && (
                                                <subSubItem.icon className="h-3.5 w-3.5 shrink-0" />
                                            )}
                                            <span className="truncate">{subSubItem.title}</span>
                                        </span>
                                    )}
                                </SidebarMenuButton>
                            );
                        })}
                    </div>
                </CollapsibleContent>
            </SidebarMenuSubItem>
        </Collapsible>
    );
}

function CollapsibleMenuItem({ item, pathname }: { item: SidebarItemConfig; pathname: string }) {
    const isActive =
        item.items?.some((subItem) => {
            if (subItem.url) return isPathActive(pathname, subItem.url);
            if (subItem.items)
                return subItem.items.some((ssi) => ssi.url && isPathActive(pathname, ssi.url));
            return false;
        }) ?? false;
    const [open, setOpen] = useState(isActive);

    // Auto open when navigating
    useEffect(() => {
        if (isActive) setOpen(true);
    }, [pathname, isActive]);

    return (
        <Collapsible defaultOpen={isActive} open={open} onOpenChange={setOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={open}
                        className={cn(
                            "w-full px-[13px] py-[10px] rounded-[12px] text-zinc-400 font-semibold text-[13px] transition-all duration-200 ease-out flex items-center gap-3",
                            "hover:bg-white/5 hover:text-white hover:translate-x-[2px] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] border border-transparent",
                            open &&
                                "bg-linear-to-r from-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.08)] text-[#F6D365] shadow-[inset_2px_0_0_#D4AF37,0_10px_22px_rgba(15,23,42,0.16)] font-bold",
                        )}
                    >
                        {item.icon && (
                            <item.icon
                                className={cn(
                                    "h-5 w-5 transition-colors shrink-0",
                                    open ? "text-[#F6D365]" : "text-zinc-500",
                                )}
                            />
                        )}
                        <span className="tracking-wide flex-1">{item.title}</span>
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200 shrink-0",
                                open ? "rotate-180 text-[#F6D365]" : "text-zinc-500",
                            )}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className="ml-2 mr-2 mb-2 p-2 pb-2 border-l-2 border-[#D4AF37]/20 bg-linear-to-b from-white/5 to-white/0 rounded-r-[14px] space-y-1">
                        {item.items?.map((subItem) => {
                            if (subItem.items && subItem.items.length > 0) {
                                return (
                                    <CollapsibleMenuSubItem
                                        key={subItem.title}
                                        item={subItem}
                                        pathname={pathname}
                                    />
                                );
                            }

                            const isSubActive = subItem.url
                                ? isPathActive(pathname, subItem.url)
                                : false;

                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isSubActive}
                                        className={cn(
                                            "w-full px-[16px] py-[6px] rounded-[9px] text-[12px] font-medium text-zinc-400 transition-all duration-200 ease-out flex items-center gap-3 border border-transparent",
                                            "hover:bg-white/5 hover:text-white hover:translate-x-[2px] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
                                            isSubActive &&
                                                "bg-linear-to-r from-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.08)] text-[#F6D365] shadow-[inset_2px_0_0_#D4AF37,0_10px_22px_rgba(15,23,42,0.16)] font-bold",
                                        )}
                                    >
                                        {subItem.url ? (
                                            <Link
                                                href={subItem.url}
                                                className="flex items-center gap-3 w-full"
                                            >
                                                {subItem.icon && (
                                                    <subItem.icon
                                                        className={cn(
                                                            "h-4 w-4 transition-colors shrink-0",
                                                            isSubActive
                                                                ? "text-[#F6D365]"
                                                                : "text-zinc-500",
                                                        )}
                                                    />
                                                )}
                                                <span className="truncate">{subItem.title}</span>
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-3 w-full">
                                                {subItem.icon && (
                                                    <subItem.icon className="h-4 w-4 text-zinc-500" />
                                                )}
                                                <span className="truncate">{subItem.title}</span>
                                            </span>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuSubItem>
                            );
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

function DirectMenuItem({ item, pathname }: { item: SidebarItemConfig; pathname: string }) {
    if (!item.url) return null;
    const isActive = isPathActive(pathname, item.url);

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                className={cn(
                    "w-full px-[13px] py-[10px] rounded-[12px] text-zinc-400 font-semibold text-[13px] transition-all duration-200 ease-out flex items-center gap-3",
                    "hover:bg-white/5 hover:text-white hover:translate-x-[2px] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] border border-transparent",
                    isActive &&
                        "bg-linear-to-r from-[rgba(212,175,55,0.24)] to-[rgba(212,175,55,0.08)] text-[#F6D365] shadow-[inset_2px_0_0_#D4AF37,0_10px_22px_rgba(15,23,42,0.16)] font-bold",
                )}
            >
                <Link href={item.url} className="flex items-center gap-3 w-full">
                    {item.icon && (
                        <item.icon
                            className={cn(
                                "h-5 w-5 transition-colors shrink-0",
                                isActive ? "text-[#F6D365]" : "text-zinc-500",
                            )}
                        />
                    )}
                    <span className="tracking-wide flex-1 truncate">{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function AppSidebar() {
    const pathname = usePathname();
    const { account } = useAuth();
    const { logout, isPending } = useFormAuth();
    const sidebarData = useSidebarData();

    return (
        <Sidebar>
            <HeaderLogo />

            <SidebarContent className="bg-[#18181B] py-3 flex flex-col gap-2 no-scrollbar">
                {sidebarData.map((group, groupIdx) => (
                    <SidebarGroup key={groupIdx} className="px-4 py-1">
                        {group.label && (
                            <SidebarGroupLabel className="px-1 py-2 mb-2 text-[11px] uppercase tracking-[0.15em] font-extrabold text-zinc-500 h-auto">
                                {group.label}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-1.5">
                                {group.items.map((item, itemIdx) => {
                                    if (item.items && item.items.length > 0) {
                                        return (
                                            <CollapsibleMenuItem
                                                key={itemIdx}
                                                item={item}
                                                pathname={pathname}
                                            />
                                        );
                                    }
                                    return (
                                        <DirectMenuItem
                                            key={itemIdx}
                                            item={item}
                                            pathname={pathname}
                                        />
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter className="border-t border-zinc-800 bg-[#18181B] py-4 px-4 mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-14 w-full px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all group shadow-sm">
                                    <div className="size-9 shrink-0 rounded bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] transition-colors group-hover:bg-[#D4AF37]/20 shadow-inner overflow-hidden">
                                        <User2 className="size-5" />
                                    </div>
                                    <div className="flex flex-col items-start ml-2 flex-1 overflow-hidden">
                                        <span className="truncate text-[13px] font-bold text-zinc-200 group-hover:text-white transition-colors w-full">
                                            {account?.user?.first_name ??
                                                account?.email?.split("@")[0] ??
                                                "User"}
                                        </span>
                                        <span className="truncate text-[10px] font-bold text-zinc-500 w-full uppercase tracking-wider">
                                            Administrator
                                        </span>
                                    </div>
                                    <ChevronDown className="ml-auto size-4 text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-64 rounded-md border-zinc-800 shadow-2xl p-1.5 dark mb-1"
                            >
                                <DropdownMenuItem
                                    onClick={async () => await logout()}
                                    className="text-red-500 focus:text-red-400 focus:bg-red-500/10 cursor-pointer rounded py-2.5 font-semibold text-xs"
                                >
                                    {isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="mr-2 size-4" />
                                    )}
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
