export function formatRank(rank) {
    if (!rank || rank === "NONE") return "NONE";

    // STAR_1 → 1-STAR-⭐
    if (rank.startsWith("STAR_")) {
        const num = rank.split("_")[1];
        return `${num}-STAR-⭐`;
    }

    return rank;
}
