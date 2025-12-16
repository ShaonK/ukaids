"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
    const router = useRouter();

    const [wallet, setWallet] = useState(null);
    const [loadingMove, setLoadingMove] = useState(false);
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);
    const [amount, setAmount] = useState("");
    const [msg, setMsg] = useState("");

    /* ================================
       Load wallet balance
    ================================= */
    async function loadWallet() {
        try {
            const res = await fetch("/api/user/wallet");
            const data = await res.json();
            setWallet(data.wallet);
        } catch (err) {
            console.error("Wallet load error:", err);
        }
    }

    /* ================================
       Check withdraw address (GUARD)
    ================================= */
    async function checkWithdrawAddress() {
        try {
            const res = await fetch("/api/user/withdraw-address");
            const data = await res.json();

            // ❌ Address not set → redirect
            if (!data || !data.address) {
                router.replace("/user/withdraw-address");
                return false;
            }
            return true;
        } catch (err) {
            console.error("Withdraw address check error:", err);
            router.replace("/user/withdraw-address");
            return false;
        }
    }

    /* ================================
       On page load
    ================================= */
    useEffect(() => {
        (async () => {
            const ok = await checkWithdrawAddress();
            if (ok) {
                await loadWallet();
            }
        })();
    }, []);

    /* ================================
       Wallet move (income → account)
    ================================= */
    async function moveWallet() {
        setLoadingMove(true);
        setMsg("");

        try {
            const res = await fetch("/api/user/move-to-account", {
                method: "POST",
            });

            const data = await res.json();
            setLoadingMove(false);

            if (!res.ok) {
                setMsg(data.error || "Wallet move failed");
                return;
            }

            setMsg(`✅ ${data.movedAmount} moved to Account Balance`);
            loadWallet();
        } catch (err) {
            setLoadingMove(false);
            setMsg("Wallet move error");
        }
    }

    /* ================================
       Submit withdraw request
    ================================= */
    async function submitWithdraw() {
        if (!amount || Number(amount) <= 0) {
            setMsg("Enter a valid withdraw amount");
            return;
        }

        setLoadingWithdraw(true);
        setMsg("");

        try {
            const res = await fetch("/api/user/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount) }),
            });

            const data = await res.json();
            setLoadingWithdraw(false);

            if (!res.ok) {
                setMsg(data.error || "Withdraw request failed");
                return;
            }

            setMsg("✅ Withdraw request sent successfully");
            setAmount("");
            loadWallet();
        } catch (err) {
            setLoadingWithdraw(false);
            setMsg("Withdraw request error");
        }
    }

    /* ================================
       Calculations
    ================================= */
    const incomeTotal =
        (wallet?.roiWallet || 0) +
        (wallet?.levelWallet || 0) +
        (wallet?.referralWallet || 0) +
        (wallet?.returnWallet || 0);

    /* ================================
       UI
    ================================= */
    return (
        <div className="p-4 text-white">
            <h1 className="text-xl font-bold mb-4 text-center">
                💸 Withdrawal
            </h1>

            {/* WALLET MOVE */}
            <div className="bg-[#1A1A1A] p-4 rounded-xl mb-4">
                <h2 className="font-semibold mb-2">Wallet Move</h2>

                <div className="text-sm text-gray-400 space-y-1">
                    <p>ROI Wallet: ${wallet?.roiWallet ?? 0}</p>
                    <p>Level Wallet: ${wallet?.levelWallet ?? 0}</p>
                    <p>Referral Wallet: ${wallet?.referralWallet ?? 0}</p>
                    <p>Return Wallet: ${wallet?.returnWallet ?? 0}</p>
                </div>

                <p className="mt-2 text-sm">
                    Total Movable:{" "}
                    <b className="text-green-400">${incomeTotal}</b>
                </p>

                <button
                    onClick={moveWallet}
                    disabled={loadingMove || incomeTotal <= 0}
                    className="mt-3 w-full py-2 rounded bg-blue-600 disabled:opacity-50"
                >
                    {loadingMove ? "Moving..." : "Move to Account"}
                </button>
            </div>

            {/* WITHDRAW REQUEST */}
            <div className="bg-[#1A1A1A] p-4 rounded-xl">
                <h2 className="font-semibold mb-2">Withdraw Request</h2>

                <p className="text-sm text-gray-400 mb-2">
                    Account Balance:{" "}
                    <b className="text-white">
                        ${wallet?.mainWallet ?? 0}
                    </b>
                </p>

                <input
                    type="number"
                    placeholder="Enter withdraw amount"
                    value={amount}
                    min="0"
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded bg-black border border-gray-700 mb-3"
                />

                {msg && (
                    <p className="text-sm text-center text-yellow-400 mb-2">
                        {msg}
                    </p>
                )}

                <button
                    onClick={submitWithdraw}
                    disabled={loadingWithdraw}
                    className="w-full py-2 rounded bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold disabled:opacity-50"
                >
                    {loadingWithdraw ? "Submitting..." : "Submit Withdraw"}
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                    ⚠️ 10% withdrawal commission applies
                </p>
            </div>
        </div>
    );
}
