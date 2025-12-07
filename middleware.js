import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token) {
    try {
        return await jwtVerify(token, SECRET);
    } catch {
        return null;
    }
}

export async function middleware(req) {
    const path = req.nextUrl.pathname;

    const publicRoutes = ["/", "/login", "/register", "/admin/login", "/blocked"];

    if (publicRoutes.includes(path)) {
        return NextResponse.next();
    }

    // USER PROTECTION
    if (path.startsWith("/user")) {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.redirect(new URL("/login", req.url));

        const user = await verifyToken(token);
        if (!user) return NextResponse.redirect(new URL("/login", req.url));

        // ⭐ BLOCK CHECK HERE
        if (user.payload.isBlocked === true) {
            return NextResponse.redirect(new URL("/blocked", req.url));
        }

        return NextResponse.next();
    }

    // ADMIN PROTECTION
    if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
        const token = req.cookies.get("admin_token")?.value;
        if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

        const admin = await verifyToken(token);
        if (!admin || admin.payload.role !== "admin") {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/user/:path*",
        "/admin/:path*",
    ],
};
