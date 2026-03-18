import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User, ChevronDown, Bell } from "lucide-react";
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

export function Navbar() {
    const { account } = useAuth();
    const { logout, isPending } = useFormAuth();

    const initials = account?.user
        ? `${account.user.first_name[0]}${account.user.last_name?.[0] ?? ""}`.toUpperCase()
        : account?.email?.[0]?.toUpperCase() ?? "U";

    const displayName = account?.user
        ? `${account.user.first_name} ${account.user.last_name ?? ""}`.trim()
        : account?.email ?? "";

    return (
        <nav className="flex items-center justify-between bg-white/95 backdrop-blur-md px-4 h-16 border-b border-border/50 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors size-9 rounded-lg" />
                <div className="h-6 w-px bg-border/50 hidden sm:block" />
                <h2 className="text-sm font-semibold text-foreground hidden sm:block">Dashboard</h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                    <Bell className="size-5" />
                    <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-white" />
                </Button>

                <div className="h-6 w-px bg-border/50" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-primary/5 transition-all cursor-pointer outline-none group border border-transparent hover:border-primary/10">
                            <Avatar className="size-8 rounded-lg">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start text-left leading-tight">
                                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                    {displayName}
                                </span>
                                {account?.role && (
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        {account.role}
                                    </span>
                                )}
                            </div>
                            <ChevronDown className="size-4 text-muted-foreground group-hover:text-primary transition-colors hidden md:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuLabel className="font-normal p-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold">{displayName}</p>
                                <p className="text-xs text-muted-foreground">{account?.email}</p>
                                {account?.role && (
                                    <Badge variant="secondary" className="mt-1 w-fit text-[10px] py-0 h-4">
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
