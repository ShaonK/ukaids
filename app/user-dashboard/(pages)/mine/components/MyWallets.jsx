"use client";

export default function MyWallets({ income = "250.00", personal = "250.00" }) {
  return (
    <div className="w-full mt-4 flex justify-center">
      {/* Gradient Border Box */}
      <div className="w-[360px] rounded-lg p-[1px] bg-[linear-gradient(90deg,#EC7B03,#3B82F6)]">
        {/* Inner Box */}
        <div className="bg-[#121212] rounded-lg flex justify-between px-4 py-1">
          {/* Income Wallet */}
          <div className="flex flex-col">
            <span className="text-white text-[14px] font-semibold">
              Income Wallet
            </span>
            <span className="text-[#E07503] text-[16px] font-bold">
              {income}
            </span>
          </div>

          {/* Personal Wallet */}
          <div className="flex flex-col text-right">
            <span className="text-white text-[14px] font-semibold">
              Personal Wallet
            </span>
            <span className="text-[#E07503] text-[16px] font-bold mt-1">
              {personal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
