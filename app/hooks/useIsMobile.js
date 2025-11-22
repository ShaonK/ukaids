"use client";

export default function useIsMobile() {
  if (typeof window === "undefined") return false;

  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    ) || window.innerWidth < 480;

  return isMobile;
}
