"use client";

export default function ProfileRankBadge({ rank }) {
    if (!rank) return null;

    const stars = {
        STAR_1: "⭐",
        STAR_2: "⭐⭐",
        STAR_3: "⭐⭐⭐",
        STAR_4: "⭐⭐⭐⭐",
        STAR_5: "⭐⭐⭐⭐⭐",
        STAR_6: "⭐⭐⭐⭐⭐⭐",
        STAR_7: "⭐⭐⭐⭐⭐⭐⭐",
    };

    return (
        <div className="absolute -bottom-1 -right-1 bg-orange-500 text-black text-xs px-2 py-0.5 rounded-full font-bold shadow">
            {stars[rank]}
        </div>
    );
}
