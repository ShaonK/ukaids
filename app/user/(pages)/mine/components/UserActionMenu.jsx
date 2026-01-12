"use client";

import { logoutAction } from "@/app/(auth-pages)/logout/action";
import { useRouter } from "next/navigation";

export default function UserActionMenu() {
  const router = useRouter();

  const items = [
    { title: "Personal Information", icon: "/icons/personal.png", path: "/user/profile" },

    // ❌ Message REMOVED

    { title: "Withdrawal", icon: "/icons/withdraw.png", path: "/user/withdraw" },
    { title: "Recharge", icon: "/icons/recharge.png", path: "/user/mine/recharge" },

    { title: "Generation History", icon: "/icons/generation-history.png", path: "/user/generation-history" },
    { title: "Balance Transfer History", icon: "/icons/balance-transfer-history.png", path: "/user/transfer/history" },
    { title: "Balance Transfer", icon: "/icons/transfer.png", path: "/user/transfer" },

    { title: "Packages", icon: "/icons/package.png", path: "/user/packages" },
    { title: "Wallet History", icon: "/icons/wallet-change.png", path: "/user/wallet/history/" },
    { title: "Withdraw History", icon: "/icons/status-history.png", path: "/user/withdraw-records" },
    { title: "Status History", icon: "/icons/status-history.png", path: "/user/status-history" },
    { title: "Invite", icon: "/icons/invite.png", path: "/user/invite" },
    { title: "About Us", icon: "/icons/about.png", path: "/about" },
    { title: "Log out", icon: "/icons/logout.png", action: "logout" }
  ];

  const createRipple = (e) => {
    const card = e.currentTarget;
    const ripple = document.createElement("span");

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";

    ripple.classList.add("ripple");
    card.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  const handleItemClick = async (item) => {
    if (item.action === "logout") {
      const res = await logoutAction();
      if (res?.success) {
        router.push("/login");
      }
      return;
    }

    if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <div className="w-full mt-6 px-4">
      <style>
        {`
        .ripple {
          position: absolute;
          background: rgba(255, 165, 0, 0.4);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-effect 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple-effect {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        `}
      </style>

      <div className="grid grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={(e) => {
              createRipple(e);
              handleItemClick(item);
            }}
            className="relative flex flex-col items-center cursor-pointer active:scale-95"
          >
            <div className="w-[68px] h-[68px] rounded-xl bg-[#1A1A1A] flex items-center justify-center border border-gray-700">
              <img src={item.icon} className="w-[36px] h-[36px]" />
            </div>

            <span className="mt-1 text-[12px] text-[#E07503] text-center">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
