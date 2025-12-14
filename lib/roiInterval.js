export function getRoiIntervalMs() {
  const mode = process.env.NEXT_PUBLIC_ROI_MODE;

  // DEV = 1 minute, LIVE = 24 hours
  if (mode === "LIVE") {
    return 24 * 60 * 60 * 1000; // 24h
  }
  return 60 * 1000; // 1 min (DEV default)
}
console.log("ROI MODE:", process.env.NEXT_PUBLIC_ROI_MODE);
