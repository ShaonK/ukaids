"use client";

import StickyBottomNav from "./components/StickyBottomNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="w-[360px] min-h-screen mx-auto bg-[#121212] text-white overflow-hidden pb-[110px]">
      {children}
      <StickyBottomNav />
    </div>
  );
}
