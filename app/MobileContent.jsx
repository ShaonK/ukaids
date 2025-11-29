"use client";

import useIsMobile from "./hooks/useIsMobile";
import MobileStatusBar from "./components/MobileStatusBar";

export default function MobileContent({ children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className="pt-0">{children}</div>;
  }

  return (
    <>
      <MobileStatusBar />
      <div className="pt-9">{children}</div>
    </>
  );
}
