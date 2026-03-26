"use client";

import Link from "next/link";
import { Users, Settings, ShieldCheck, ArrowRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/auth/server/use.auth";

const MENU_ITEMS = [
    {
        title: "Pengguna",
        description: "Kelola akun pengguna, role, dan status akses",
        href: "/settings/users",
        icon: Users,
        badge: null,
    },
    {
        title: "Roles & Permissions",
        description: "Atur hak akses berdasarkan peran pengguna",
        href: "/settings/roles",
        icon: ShieldCheck,
        badge: "Soon",
    },
    {
        title: "Pengaturan Umum",
        description: "Konfigurasi umum aplikasi dan preferensi sistem",
        href: "/settings/general",
        icon: Settings,
        badge: "Soon",
    },
];

export function SettingsPage() {
    const { account } = useAuth();

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Pengaturan</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Konfigurasi sistem dan manajemen pengguna
                </p>
            </div>

            {/* Account Info */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Info className="size-4" /> Akun Aktif
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                            {account?.email?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">
                                {account?.user
                                    ? `${account.user.first_name} ${account.user.last_name ?? ""}`.trim()
                                    : account?.email}
                            </p>
                            <p className="text-sm text-muted-foreground">{account?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{account?.role}</Badge>
                                <Badge
                                    variant={account?.status === "ACTIVE" ? "default" : "secondary"}
                                    className="text-xs"
                                >
                                    {account?.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Menu */}
            <div className="grid gap-3">
                {MENU_ITEMS.map((item) => {
                    const isSoon = item.badge === "Soon";
                    const content = (
                        <Card
                            className={`transition-shadow ${isSoon ? "opacity-60" : "hover:shadow-md cursor-pointer"}`}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-lg bg-gray-100">
                                        <item.icon className="size-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-800">{item.title}</p>
                                            {item.badge && (
                                                <Badge variant="outline" className="text-xs">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {item.description}
                                        </p>
                                    </div>
                                    {!isSoon && (
                                        <ArrowRight className="size-4 text-gray-400 flex-shrink-0" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );

                    return isSoon ? (
                        <div key={item.href}>{content}</div>
                    ) : (
                        <Link key={item.href} href={item.href}>
                            {content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
