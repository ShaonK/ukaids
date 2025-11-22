"use client";

import useIsMobile from "../hooks/useIsMobile";
import MobileStatusBarDesktopOnly from "./MobileStatusBarDesktopOnly";

export default function MobileStatusBar() {
  const isMobile = useIsMobile();

  // এখানে safe conditional render
  // এখানে কোনো hook নেই
  return isMobile ? null : <MobileStatusBarDesktopOnly />;
}
