"use client";

import DashboardCard from "./components/DashboardCard";
import FeatherImage from "./components/FeatherImage";
import IncomeOptions from "./components/IncomeOptions";
import InviteButton from "./components/InviteButton";
import QuickActions from "./components/QuickActions";
import SpeakerMessage from "./components/SpeakerMessage";
import TaskCard from "./components/TaskCard";
import UserAmountSummaryCard from "./components/UserAmountSummaryCard";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <>
      <div>

        <div className="relative mx-auto w-[360px] min-h-screen bg-[#121212]">

          {/* BG IMAGE */}
          <div className="absolute inset-0 w-[360px] h-[350px] rounded-[8px] overflow-hidden z-0">
            <Image
              src="/user-d-hero-bg.png"
              alt="Dashboard BG"
              fill
              className="object-cover rounded-[8px]"
              priority
            />
            <div className="absolute inset-0 bg-[#000000CC] rounded-[8px]"></div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="relative z-10 pt-3 space-y-4">
            <UserAmountSummaryCard title="Account Balance" amount="25.00 USD" />
            <UserAmountSummaryCard title="Income Balance" amount="25.00 USD" />
            <UserAmountSummaryCard title="refarral Balance" amount="12.00 USD" />
            <UserAmountSummaryCard title="Total Earned" amount="100.00 USD" />
          </div>

          <SpeakerMessage />
          <QuickActions />
          <InviteButton />
          <IncomeOptions />
          <FeatherImage />

          <TaskCard
            tag="A1"
            icon="/tcardimage.png"
            order="16.00 / Each Order"
            tasks="Daily Tasks : 01"
            deposit="Deposit : 25.00$"
          />

          <TaskCard
            tag="A2"
            icon="/tcardimage.png"
            order="16.00 / Each Order"
            tasks="Daily Tasks : 02"
            deposit="Deposit : 75.00$"
          />

          <TaskCard
            tag="A3"
            icon="/tcardimage.png"
            order="16.00 / Each Order"
            tasks="Daily Tasks : 03"
            deposit="Deposit : 125.00$"
          />
        </div>
      </div>
    </>
  );
}
