"use client";
import Image from "next/image";

export default function QuickActions() {
  const actions = [
    { icon: "/diposi.png", label: "Diposit" },
    { icon: "/withdraw.png", label: "Withdrawa" },
    { icon: "/earning.png", label: "Earning" },
    { icon: "/plans.png", label: "Plans" },
  ];

  return (
    <div className="w-full mt-6 px-4">
      <div className="flex justify-between items-center">
        {actions.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Icon Box */}
            <div className="w-[70px] h-[70px] flex justify-center items-center border border-[#FEFEFE1A]">
              <Image
                src={item.icon}
                alt={item.label}
                width={100}
                height={100}
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
          </div>
        ))}
      </div>
    </div>
  );
}
