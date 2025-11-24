"use client";

import useIsMobile from "./hooks/useIsMobile";
import MobileStatusBar from "./components/MobileStatusBar";

export default function MobileWrapper({ children }) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="pt-0">{children}</div>
      ) : (
        <>
          <MobileStatusBar />
          <div className="pt-9">{children}</div>
        </>
      )}
    </>
  );
}
