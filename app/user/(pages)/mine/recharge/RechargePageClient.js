"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RechargePageClient() {
    const router = useRouter();

    const depositAddress =
        "TLaot66AMVYRtxwGeVdQgnmrrv6X9txA6L";

    const NETWORK = "TRC20";

    const [amount, setAmount] = useState("");
    const [trx, setTrx] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${depositAddress}&size=220x220`;

    function copyAddress() {
        navigator.clipboard.writeText(depositAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!amount || !trx) {
            alert("Please provide amount and transaction ID.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/user/recharge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    trxId: trx,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Recharge request submitted. Await admin approval.");
                router.push("/user");
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            alert("Server error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 flex flex-col items-center text-white">
            <h2 className="text-xl font-semibold mb-4">
                Recharge / Deposit
            </h2>

            <div className="w-[340px] bg-[#121212] border border-gray-800 rounded-xl p-5 space-y-4">

                {/* NETWORK INFO */}
                <div className="bg-[#1A1A1A] border border-orange-600/40 rounded-lg px-3 py-2 text-center">
                    <p className="text-xs text-gray-400">
                        Send only via network
                    </p>
                    <p className="text-sm font-semibold text-orange-400">
                        {NETWORK}
                    </p>
                </div>

                {/* ADDRESS */}
                <div
                    onClick={copyAddress}
                    className="bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 text-center cursor-pointer"
                >
                    <p className="text-sm font-mono break-all">
                        {depositAddress}
                    </p>
                    <p className="text-xs mt-1 text-orange-400">
                        {copied ? "Address Copied!" : "Tap to copy address"}
                    </p>
                </div>

                {/* WARNING */}
                <p className="text-[11px] text-center text-red-400">
                    ⚠️ Sending via any other network will result in permanent loss.
                </p>

                {/* QR */}
                <div className="flex justify-center">
                    <img
                        src={qrUrl}
                        alt="QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg border border-gray-700"
                    />
                </div>

                {/* FORM */}
                <form className="space-y-3" onSubmit={handleSubmit}>
                    {/* TRANSACTION ID */}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Transaction ID *
                        </label>
                        <input
                            value={trx}
                            onChange={(e) => setTrx(e.target.value)}
                            placeholder="Enter TRX / Hash ID"
                            className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        />
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Amount *
                        </label>
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount sent"
                            type="number"
                            className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#EC7B03] to-[#FF9F1C] text-black active:scale-95 transition disabled:opacity-60"
                    >
                        {loading ? "Submitting..." : "Deposit Now"}
                    </button>
                </form>
            </div>
        </div>
    );
}
