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

  /* =========================
     1️⃣ PDF API BYPASS (IMPORTANT)
     ========================= */
  if (path.startsWith("/api/pdf")) {
    return NextResponse.next();
  }

  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/admin/login",
    "/blocked",
  ];

  /* =========================
     2️⃣ PUBLIC ROUTES
     ========================= */
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  /* =========================
     3️⃣ USER PROTECTION
     ========================= */
  if (path.startsWith("/user")) {
    const token = req.cookies.get("token")?.value;

    // ❌ No token → redirect
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = await verifyToken(token);

    // ❌ Invalid token → redirect
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ❌ Blocked user
    if (user.payload.isBlocked === true) {
      return NextResponse.redirect(new URL("/blocked", req.url));
    }

    return NextResponse.next();
  }

  /* =========================
     4️⃣ ADMIN PROTECTION
     ========================= */
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const admin = await verifyToken(token);

    if (!admin || admin.payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

/* =========================
   MATCHER
   ========================= */
export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/api/pdf/:path*", // ✅ MUST INCLUDE
  ],
};
