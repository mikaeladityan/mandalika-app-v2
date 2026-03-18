"use client";

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

function CollapsibleMenuItem({ item, pathname }: { item: SidebarItemConfig; pathname: string }) {
    const isActive =
        item.items?.some((subItem) => subItem.url && isPathActive(pathname, subItem.url)) ?? false;
    const [open, setOpen] = useState(isActive);

    // Auto open when navigating
    useEffect(() => {
        if (isActive) setOpen(true);
    }, [pathname, isActive]);

    return (
        <Collapsible defaultOpen={isActive} open={open} onOpenChange={setOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={open} className="text-white hover:text-white">
                        {item.icon && <item.icon className="h-4.5 w-4.5" />}
                        <span className="font-semibold">{item.title}</span>
                        <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform text-white/50 ${open ? "rotate-180" : ""}`}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        subItem.url ? isPathActive(pathname, subItem.url) : false
                                    }
                                >
                                    {subItem.url ? (
                                        <Link
                                            href={subItem.url}
                                            className="flex items-center gap-2"
                                        >
                                            {subItem.icon && (
                                                <subItem.icon className="h-4 w-4 text-white/70" />
                                            )}
                                            <span className="text-white/80 group-hover:text-white">
                                                {subItem.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="text-white/80">{subItem.title}</span>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

function DirectMenuItem({ item, pathname }: { item: SidebarItemConfig; pathname: string }) {
    if (!item.url) return null;
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isPathActive(pathname, item.url)}
                className="text-white hover:text-white"
            >
                <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4.5 w-4.5" />}
                    <span className="font-semibold">{item.title}</span>
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

            <SidebarContent className="bg-sidebar py-3 flex flex-col gap-2 no-scrollbar">
                {sidebarData.map((group, groupIdx) => (
                    <SidebarGroup key={groupIdx} className="px-3 py-1">
                        {group.label && (
                            <SidebarGroupLabel className="px-2 mb-2 text-[10px] uppercase tracking-[0.2em] font-black text-white/40">
                                {group.label}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <SidebarMenu className="capitalize gap-1">
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
            <SidebarFooter className="border-t border-white/5 bg-sidebar py-5 px-4 mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-11 rounded-xl border border-white/5 bg-white/5 shadow-xs hover:bg-primary hover:text-white hover:border-primary transition-all group">
                                    <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center text-primary transition-colors group-hover:bg-white group-hover:text-primary shadow-inner">
                                        <User2 className="size-4.5" />
                                    </div>
                                    <span className="truncate font-bold text-white/90">
                                        {account?.user?.first_name ?? account?.email?.split("@")[0]}
                                    </span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="w-48">
                                <DropdownMenuItem
                                    onClick={async () => await logout()}
                                    className="text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
                                >
                                    {isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="mr-2 size-4" />
                                    )}
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
