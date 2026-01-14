// lib/getUserRank.js
export async function getUserRank() {
  const res = await fetch("/api/user/rank", {
    cache: "no-store"
  });
  if (!res.ok) return null;
  return res.json();
}
