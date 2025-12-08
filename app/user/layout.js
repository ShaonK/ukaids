"use client";

import NavBar from "./components/NavBar";
import StickyBottomNav from "./components/StickyBottomNav";

export default function UserLayout({ children }) {
  return (
    <div className="w-[360px] mx-auto bg-[#121212] text-white min-h-screen relative overflow-hidden">

      {/* --- FIXED NAVBAR --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[360px] z-50">
        <NavBar />
      </div>

      {/* --- MAIN SCROLLABLE CONTENT --- */}
      <div className="pt-[40px] pb-[70px] overflow-y-auto">
        {children}
      </div>

      {/* --- FIXED BOTTOM NAV --- */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[360px] z-50">
        <StickyBottomNav />
      </div>

    </div>
  );
}
