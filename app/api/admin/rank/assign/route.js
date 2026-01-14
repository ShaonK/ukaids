import { NextResponse } from "next/server";
import { VIP_RANKS } from "@/lib/vipConfig";
import { adminAssignRank } from "@/lib/adminRankService";

export async function POST(req) {
    try {
        const { adminId, userId, rank } = await req.json();
        const rule = VIP_RANKS.find((r) => r.rank === rank);

        if (!rule) {
            return NextResponse.json(
                { error: "Invalid rank" },
                { status: 400 }
            );
        }

        await adminAssignRank(adminId, userId, rule);

        return NextResponse.json({
            success: true,
            message: "Rank assigned successfully",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
