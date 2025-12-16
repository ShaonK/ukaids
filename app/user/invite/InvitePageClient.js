"use client";

import { useEffect, useState } from "react";

export default function InvitePageClient() {
    const [user, setUser] = useState(null);
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);

        async function loadUser() {
            try {
                const res = await fetch("/api/user/me", {
                    cache: "no-store",
                });
                const data = await res.json();
                setUser(data?.user);
            } catch (e) {
                console.error("LOAD USER ERROR:", e);
            }
        }

        loadUser();
    }, []);

    if (!user || !origin) {
        return (
            <div className="text-center text-gray-400 py-20">
                Loading invite page…
            </div>
        );
    }

    const inviteCode = user.referralCode || user.username;
    const inviteLink = `${origin}/register?ref=${inviteCode}`;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        inviteLink
    )}`;

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const shareInvite = async () => {
        if (navigator.share) {
            await navigator.share({
                title: "Join with my referral",
                text: "Register using my invite link",
                url: inviteLink,
            });
        } else {
            copyLink();
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center p-4">
            <h1 className="text-xl font-bold mt-4">
                Invite & Earn
            </h1>

            {/* QR CODE */}
            <div className="mt-6 bg-white p-3 rounded-lg">
                <img src={qrUrl} alt="Invite QR" />
            </div>

            {/* REFERRAL CODE */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                    Your Referral Code
                </p>
                <p className="text-lg font-bold text-[#EC7B03]">
                    {inviteCode}
                </p>
            </div>

            {/* INVITE LINK */}
            <div
                onClick={copyLink}
                className="mt-4 w-[320px] bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-xs break-all cursor-pointer"
            >
                {inviteLink}
                <div className="text-center text-[11px] text-orange-400 mt-1">
                    {copied ? "Copied!" : "Tap to copy invite link"}
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-6">
                <button
                    onClick={copyLink}
                    className="px-4 py-2 rounded bg-[#EC7B03] text-black font-semibold"
                >
                    Copy Link
                </button>

                <button
                    onClick={shareInvite}
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                >
                    Share
                </button>
            </div>
        </div>
    );
}
