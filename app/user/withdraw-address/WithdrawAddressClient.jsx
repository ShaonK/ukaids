"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawAddressClient() {
    const router = useRouter();

    const [address, setAddress] = useState("");
    const [network, setNetwork] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    async function saveAddress() {
        if (!address || !network) {
            setMsg("Address and network are required");
            return;
        }

        setLoading(true);
        setMsg("");

        try {
            const res = await fetch("/api/user/withdraw-address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address,
                    network,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMsg(data.error || "Failed to save withdraw address");
                setLoading(false);
                return;
            }

            // ✅ success → back to withdraw page
            router.replace("/user/withdraw");
        } catch (err) {
            console.error(err);
            setMsg("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 max-w-md mx-auto text-white">
            <h1 className="text-xl font-bold mb-4 text-center">
                🔐 Set Withdraw Address
            </h1>

            <div className="bg-[#1A1A1A] p-4 rounded-xl space-y-4">
                {/* TOKEN (FIXED) */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        Token
                    </label>
                    <input
                        value="USDT"
                        disabled
                        className="w-full p-2 rounded bg-black border border-gray-700 text-gray-400"
                    />
                </div>

                {/* ADDRESS */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        Binance Address
                    </label>
                    <input
                        type="text"
                        placeholder="Enter USDT address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 rounded bg-black border border-gray-700"
                    />
                </div>

                {/* NETWORK */}
                <div>
                    <label className="text-xs text-gray-400 block mb-1">
                        Network
                    </label>
                    <select
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        className="w-full p-2 rounded bg-black border border-gray-700"
                    >
                        <option value="">Select Network</option>
                        <option value="TRC20">USDT (TRC20)</option>
                        <option value="BEP20">USDT (BEP20)</option>
                        <option value="ERC20">USDT (ERC20)</option>
                    </select>
                </div>

                <p className="text-xs text-yellow-400 text-center">
                    ⚠️ Only USDT withdrawals are supported
                </p>

                {msg && (
                    <p className="text-sm text-center text-red-400">
                        {msg}
                    </p>
                )}

                <button
                    onClick={saveAddress}
                    disabled={loading}
                    className="w-full py-2 rounded bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Address"}
                </button>
            </div>
        </div>
    );
}
