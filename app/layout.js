"use client";

import MobileStatusBar from "./components/MobileStatusBar";
import "./globals.css";

export default function RootLayout({ children }) {
  // Detect mobile DURING render (React-approved)
  const isMobile =
    typeof window !== "undefined" &&
    (/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    ) ||
      window.innerWidth < 480);

  return (
    <html lang="en" className="bg-black">
      <body className="flex justify-center bg-black font-inter">
        <div className="w-[360px] min-h-screen bg-black text-white shadow-xl overflow-hidden relative">
          {/* Desktop Only */}
          {isMobile ? null : <MobileStatusBar />}

          {/* Content with dynamic padding */}
          <div className={isMobile ? "pt-0" : "pt-9"}>{children}</div>
        </div>
      </body>
    </html>
  );
}
