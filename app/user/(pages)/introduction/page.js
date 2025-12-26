import Image from "next/image";
import GlassCard from "./GlassCard";
import IntroductionClient from "./IntroductionClient";

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white px-4 pb-32">

      {/* 🔹 WELCOME (OUTSIDE PDF) */}
      <div className="max-w-4xl mx-auto mt-10 text-center flex flex-col items-center">
        <Image
          src="/introduction/welcome.png"
          alt="UKAIDS Welcome"
          width={320}
          height={200}
          className="rounded-xl shadow-md"
        />
        <h1 className="text-3xl font-bold mt-5">Welcome to UKAIDS</h1>
        <p className="text-gray-400 mt-2 max-w-md text-center mx-auto">
          A Transparent & Structured Income Ecosystem
        </p>

      </div>

      {/* 📄 PDF CONTENT START */}
      <div
        id="pdf-content"
        className="max-w-4xl mx-auto mt-8 border border-white/10 rounded-3xl p-4 sm:p-6"
      >
        <div className="space-y-6">

          {/* ROI */}
          <GlassCard>
            <Image src="/introduction/roi.png" alt="" width={600} height={350} className="mx-auto rounded-xl" />
            <h2 className="text-lg font-semibold">ROI System (Return on Investment)</h2>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• ROI Rate → 2% per day</li>
              <li>• Active 5 days per week</li>
              <li>• Off days → Saturday & Sunday</li>
              <li>• ROI Cap → 2× of deposit</li>
              <li>• After 2×, ID becomes inactive</li>
              <li>• Remaining balance goes to Return Wallet</li>
            </ul>
          </GlassCard>

          {/* Direct Referral */}
          <GlassCard>
            <Image src="/introduction/referral.png" alt="" width={600} height={350} className="mx-auto rounded-xl" />
            <h2 className="text-lg font-semibold">Direct Referral Commission</h2>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Level 1 → 10%</li>
              <li>• Level 2 → 3%</li>
              <li>• Level 3 → 2%</li>
              <li className="text-white font-semibold">• Total → 15%</li>
              <li>• Inactive ID shifts income upward</li>
              <li>• Applies once per deposit</li>
            </ul>
          </GlassCard>

          {/* ROI Level */}
          <GlassCard>
            <Image src="/introduction/roi-level.png" alt="" width={600} height={350} className="mx-auto rounded-xl" />
            <h2 className="text-lg font-semibold">ROI Level Income System</h2>
            <p className="text-gray-400 text-sm">ROI (2%) is considered as 100%</p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Level 1 → 5%</li>
              <li>• Level 2 → 4%</li>
              <li>• Level 3 → 3%</li>
              <li>• Level 4 → 2%</li>
              <li>• Level 5 → 1%</li>
              <li>• Each level requires 1 active direct referral</li>
            </ul>
          </GlassCard>

          {/* VIP */}
          <GlassCard>
            <Image src="/introduction/vip-rank.png" alt="" width={600} height={350} className="mx-auto rounded-xl" />
            <h2 className="text-lg font-semibold">VIP Rank System</h2>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Rank based monthly salary</li>
              <li>• Salary starts after 30 days</li>
              <li>• Released monthly</li>
              <li>• 7 Star rank is lifetime</li>
              <li>• Admin configurable</li>
            </ul>
          </GlassCard>

          {/* Handshake */}
          <GlassCard>
            <Image src="/introduction/handshake.png" alt="" width={520} height={300} className="mx-auto rounded-xl" />
            <h3 className="text-lg font-semibold text-center">
              Thank You for Being with UKAIDS
            </h3>
            <p className="text-gray-400 text-center text-sm">
              Together We Grow with Transparency & Trust
            </p>
          </GlassCard>
        </div>
      </div>
      {/* 📄 PDF CONTENT END */}

      {/* 🔘 BUTTONS (OUTSIDE PDF, FULL WIDTH) */}
      <div className="max-w-4xl mx-auto mt-8 px-2">
        <IntroductionClient />
      </div>

    </div>
  );
}
