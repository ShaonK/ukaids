import { NextResponse } from "next/server";
import { runMonthlySalaryPayout } from "@/lib/salaryPayoutService";

export async function POST() {
    try {
        const result = await runMonthlySalaryPayout();
        return NextResponse.json({
            success: true,
            result,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
