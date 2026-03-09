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
                    <SidebarMenuButton isActive={open}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                        <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
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
                                        <Link href={subItem.url}>
                                            {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                            <span>{subItem.title}</span>
                                        </Link>
                                    ) : (
                                        <span>{subItem.title}</span>
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
            <SidebarMenuButton asChild isActive={isPathActive(pathname, item.url)}>
                <Link href={item.url}>
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
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

            <SidebarContent className="pt-4 bg-white">
                {sidebarData.map((group, groupIdx) => (
                    <SidebarGroup key={groupIdx}>
                        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                        <SidebarGroupContent>
                            <SidebarMenu className="capitalize">
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
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 className="h-4 w-4" />
                                    <span className="truncate">
                                        {account?.user?.first_name ?? account?.email?.split("@")[0]}
                                    </span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="end">
                                <DropdownMenuItem
                                    onClick={async () => await logout()}
                                    className="text-red-600"
                                >
                                    {isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="mr-2 h-4 w-4" />
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
