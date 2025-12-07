"use client";

import NavBar from "./components/NavBar";
import StickyBottomNav from "./components/StickyBottomNav";

export default function UserLayout({ children }) {
  return (
    <div className="w-[360px] min-h-screen mx-auto bg-[#121212] text-white overflow-hidden pb-[110px]">
      <NavBar />
      {children}
      <StickyBottomNav />
    </div>
  );
}
