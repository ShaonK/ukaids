"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: "/diposi.png",
      label: "Deposit",
      path: "/user/mine/recharge",
    },
    {
      icon: "/withdraw.png",
      label: "Withdraw",
      path: "/user/withdraw",
    },
    {
      icon: "/earning.png",
      label: "Earning",
      path: "/user/wallet/history",
    },
    {
      icon: "/plans.png",
      label: "Packages",
      path: "/user/packages",
    },
  ];

  return (
    <div className="w-full mt-6 px-4">
      <div className="flex justify-between items-center">
        {actions.map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.path)}
            className="
              flex flex-col items-center
              active:scale-95 transition-transform
            "
          >
            {/* Icon Box */}
            <div
              className="
                w-[70px] h-[70px]
                flex justify-center items-center
                border border-[#FEFEFE1A]
                rounded-lg
                hover:shadow-[0_0_12px_#EC7B03]
                transition-all
              "
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={42}
                height={42}
                className="object-contain"
              />
            </div>

            {/* Label */}
            <p
              className="mt-2 text-[12px] font-bold"
              style={{
                background:
                  "linear-gradient(90deg, #C9771E 0%, #CCCCCC 43.75%, #96632D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {item.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
