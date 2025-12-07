"use client";

export default function UserActionMenu() {
  const items = [
    { title: "Personal Information", icon: "/icons/personal.png" },
    { title: "Message", icon: "/icons/message.png" },
    { title: "Withdrawal", icon: "/icons/withdraw.png" },
    { title: "Recharge", icon: "/icons/recharge.png" },

    { title: "Withdrawal Records", icon: "/icons/withdraw-record.png" },
    { title: "Recharge Records", icon: "/icons/recharge-record.png" },
    { title: "Wallet Changes", icon: "/icons/wallet-change.png" },
    { title: "Invite", icon: "/icons/invite.png" },

    { title: "About Us", icon: "/icons/about.png" },
    { title: "Log out", icon: "/icons/logout.png" },
  ];

  // Ripple Click Effect Function
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

        @keyframes bounce-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        `}
      </style>

      <div className="grid grid-cols-4 gap-4">

        {items.map((item, index) => (
          <div
            key={index}
            onClick={createRipple}
            className="
              relative
              flex flex-col items-center cursor-pointer
              transition-all duration-200
              active:scale-95
            "
          >
            {/* Icon Box */}
            <div
              className="
                w-[68px] h-[68px] rounded-xl bg-[#1A1A1A]
                flex items-center justify-center
                transition-all duration-300 shadow-md
                border border-transparent
                hover:border-[2px]
                hover:border-transparent
                hover:bg-[rgba(255,255,255,0.05)]
                hover:shadow-[0_0_12px_#EC7B03]
                hover:animate-bounce-icon
                hover:bg-gradient-to-br hover:from-[#3B82F6] hover:to-[#EC7B03]
                hover:p-[2px]
              "
            >
              <div className="w-full h-full rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                <img
                  src={item.icon}
                  className="w-[36px] h-[36px] transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Label */}
            <span
              className="
                mt-1 text-[12px] text-[#E07503] text-center
                transition-all duration-200 group-hover:text-[#ffa650]
              "
            >
              {item.title}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}
