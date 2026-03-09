// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
    "/auth",
    "/auth/register",
    // "/auth/forgot-password",
    // "/auth/reset-password",
    // "/auth/verify-email",
];

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

    // Hanya cek SESSION cookie sebagai penentu login (XSRF bisa ada tanpa session aktif)
    const hasSession = !!req.cookies.get(process.env.NEXT_PUBLIC_SESSION_NAME!);

    // ❌ Belum login → protected
    if (!hasSession && !isPublic) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth";
        return NextResponse.redirect(url);
    }

    // ✅ Sudah login → halaman auth
    if (hasSession && isPublic) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api).*)"],
};
