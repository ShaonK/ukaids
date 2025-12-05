"use server";

import { cookies } from "next/headers";

export async function adminLogoutAction() {
    const cookieStore = await cookies();

    // remove admin_token
    cookieStore.set("admin_token", "", {
        httpOnly: true,
        secure: false,
        expires: new Date(0),   // delete now
        path: "/",
    });

    return { success: true };
}
