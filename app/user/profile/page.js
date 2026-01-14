"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import ProfileRankBadge from "./components/ProfileRankBadge";
import SalaryStatus from "./components/SalaryStatus";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/user/profile", {
        cache: "no-store",
      });
      const data = await res.json();
      setProfile(data);
    }
    loadProfile();
  }, []);

  if (!profile) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div className="mx-auto w-[360px] min-h-screen bg-[#121212] text-white p-4">
      <div className="bg-[#111] rounded-xl p-4 border border-gray-700">
        {/* AVATAR */}
        <div className="flex justify-center relative">
          <div className="relative">
            <div className="p-[3px] rounded-full bg-gradient-to-r from-orange-500 to-blue-500">
              <Image
                src={profile.avatar || "/useravater.png"}
                alt="avatar"
                width={96}
                height={96}
                className="rounded-full bg-black"
              />
            </div>

            <ProfileRankBadge rank={profile.userRank?.rank} />
          </div>
        </div>

        {/* INFO */}
        <div className="text-center mt-3">
          <h2 className="font-semibold text-lg">{profile.fullname}</h2>
          <p className="text-sm text-gray-400">@{profile.username}</p>

          {profile.userRank && (
            <>
              <p className="text-sm text-orange-400 mt-2">
                {profile.userRank.rank.replace("_", " ")}
                {profile.userRank.isLifetime && " • Lifetime"}
              </p>
              <SalaryStatus rank={profile.userRank} />
            </>
          )}
        </div>

        {/* META */}
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <p>Email: {profile.email || "N/A"}</p>
          <p>Mobile: {profile.mobile}</p>
          <p>Referral Code: {profile.referralCode}</p>
          <p>
            Joined: {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
