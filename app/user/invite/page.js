"use client";

import { useEffect, useState } from "react";

export default function InvitePage() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setUser(data?.user);
    }
    loadUser();
  }, []);

  if (!user) {
    return (
      <div className="text-center text-gray-400 py-20">
        Loading invite page...
      </div>
    );
  }

  if (!user.referralCode) {
    return (
      <div className="text-center text-red-400 py-20">
        Referral code not available.
      </div>
    );
  }

  const inviteCode = user.referralCode;
  const inviteLink = `${window.location.origin}/register?ref=${inviteCode}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    inviteLink
  )}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mt-4">Invite & Earn</h1>

      <div className="mt-6 bg-white p-3 rounded-lg">
        <img src={qrUrl} alt="Invite QR" />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">Your Referral Code</p>
        <p className="text-lg font-bold text-[#EC7B03]">{inviteCode}</p>
      </div>

      <div
        onClick={copyLink}
        className="mt-4 w-[320px] bg-[#1A1A1A] border border-gray-700 rounded-lg p-3 text-xs break-all cursor-pointer"
      >
        {inviteLink}
        <div className="text-center text-[11px] text-orange-400 mt-1">
          {copied ? "Copied!" : "Tap to copy invite link"}
        </div>
      </div>
    </div>
  );
}
