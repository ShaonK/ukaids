import { getUser } from "@/lib/getUser";

export async function GET() {
    try {
        const user = await getUser();

        if (!user) {
            return Response.json({ user: null }, { status: 401 });
        }

        return Response.json({
            user: {
                id: user.id,
                username: user.username,
                referralCode: user.referralCode,
            },
        });
    } catch (err) {
        console.error("USER ME ERROR:", err);
        return Response.json({ user: null }, { status: 500 });
    }
}
