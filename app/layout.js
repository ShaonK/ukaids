"use client";
import MobileStatusBar from "./components/MobileStatusBar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex justify-center bg-black font-inter">

        {/* FULL PAGE CENTERED MOBILE VIEW */}
        <div className="w-[360px] min-h-screen bg-black text-white shadow-xl overflow-hidden relative">

          {/* Mobile Status Bar FIXED INSIDE */}
          <MobileStatusBar />

          {/* Page Content */}
          <div className="pt-2">
            {children}
          </div>

        </div>

      </body>
    </html>
  );
}
