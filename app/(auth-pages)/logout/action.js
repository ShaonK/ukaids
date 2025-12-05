"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
    const cookieStore = await cookies();

    // Remove the token cookie
    cookieStore.set("token", "", {
        httpOnly: true,
        secure: false,
        maxAge: 0,
        path: "/",
    });

    return { success: true };
}
