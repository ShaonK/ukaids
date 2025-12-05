import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token) {
    try {
        return await jwtVerify(token, SECRET);
    } catch (err) {
        return null;
    }
}

export async function middleware(req) {
    const path = req.nextUrl.pathname;

    const publicPaths = ["/", "/login", "/register"];

    if (publicPaths.includes(path)) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    const user = token ? await verifyToken(token) : null;

    // USER ROUTES
    if (path.startsWith("/user")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    }

    // ADMIN ROUTES
    if (path.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        // শুধুমাত্র admin ইউজার ঢুকতে পারবে
        if (user.payload.username !== "admin") {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/user/:path*", "/admin/:path*"],
};

