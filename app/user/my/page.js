"use client";

import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import { logoutAction } from "@/app/(auth-pages)/logout/action";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MyPage() {
    const router = useRouter();

    async function handleLogout() {
        await logoutAction();
        router.push("/login"); // Redirect to login after logout
    }

    return (
        <div className="space-y-4">

            <Card>
                <h2 className="text-lg font-bold text-gray-800">My Profile</h2>

                <div className="mt-2 text-sm text-gray-600">
                    <p>Username: demo_user</p>
                    <p>Mobile: 0123456789</p>
                    <p>Email: demo@mail.com</p>
                </div>
            </Card>

            <Card>
                <h3 className="font-semibold text-gray-700">Wallet Summary</h3>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    <li>Main Wallet: $0</li>
                    <li>ROI Wallet: $0</li>
                    <li>Referral Wallet: $0</li>
                    <li>Level Wallet: $0</li>
                    <li>Salary Wallet: $0</li>
                    <li>Return Wallet: $0</li>
                </ul>
            </Card>

            <Button label="Deposit" className="bg-blue-600" />
            <Button label="Withdraw" className="bg-green-600" />

            {/* ✔ LOGOUT BUTTON */}
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white w-full p-3 rounded-xl shadow active:scale-95 transition"
            >
                Logout
            </button>
        </div>
    );
}
