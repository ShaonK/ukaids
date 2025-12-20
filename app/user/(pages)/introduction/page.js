import InvitationRewardTable from "./components/InvitationRewardTable";
import LevelBenefitTable from "./components/LevelBenefitTable";
import LevelDescriptionList from "./components/LevelDescriptionList";
import TaskCommissionTable from "./components/TaskCommissionTable";
import UserIntroHero from "./components/UserIntroHero";

export const metadata = {
  title: "Introduction | UKAIDS",
};

export default function IntroductionPage() {
  const tableData = {
    header: [
      "ukaids",
      "Deposit",
      "Number of working days",
      "Mission income",
      "Daily income",
      "30 days income",
      "360 days income",
    ],

    intern: ["intern", "0", "5", "16", "0", "0", "0"],

    sections: [
      {
        title: "ENTRY-LEVEL POSITIONS",
        rows: [
          ["A1", "3000", "5", "20", "100", "3000", "36000"],
          ["A2", "8400", "10", "28", "280", "8400", "108000"],
          ["A3", "23500", "20", "40", "800", "24000", "288000"],
        ],
      },

      {
        title: "MID-LEVEL POSITIONS",
        rows: [
          ["K1", "60000", "30", "70", "2100", "63000", "756000"],
          ["K2", "168000", "50", "120", "6000", "180000", "2160000"],
          ["K3", "470000", "100", "170", "17000", "510000", "6120000"],
        ],
      },

      {
        title: "SENIOR POSITIONS",
        rows: [
          ["W1", "690000", "130", "200", "26000", "780000", "9360000"],
          ["W2", "1380000", "180", "300", "54000", "1620000", "19440000"],
          ["W3", "2760000", "250", "450", "112500", "3375000", "40500000"],
        ],
      },

      {
        title: "CORPORATE PARTNER",
        rows: [
          ["ukaids", "5520000", "400", "600", "240000", "7200000", "86400000"],
        ],
      },
    ],
  };
  const sections = [
    {
      title: "Entry-level positions",
      items: [
        {
          position: "A1",
          description:
            "Pay a deposit of 3,000 BDT, perform 5 tasks per day, earn 20 BDT per task, 100 BDT per day, 3,000 BDT in 30 days, and 36,000 BDT in 360 days.",
        },
        {
          position: "A2",
          description:
            "Pay a deposit of 8,400 BDT, complete 10 tasks per day, earn 28 BDT for each task, 280 BDT per day, 8,400 BDT in 30 days, and 108,000 BDT in 360 days.",
        },
        {
          position: "A3",
          description:
            "Pay a deposit of 23,500 BDT, complete 20 tasks per day, earn 40 BDT per task, 800 BDT per day, 24,000 BDT in 30 days, and 288,000 BDT in 360 days.",
        },
      ],
    },

    {
      title: "Mid-level positions",
      items: [
        {
          position: "K1",
          description:
            "Pay a deposit of 60,000 BDT, complete 30 tasks per day, earn 70 BDT per task, 2,100 BDT per day, earn 63,000 BDT in 30 days, and earn 756,000 BDT in 360 days.",
        },
        {
          position: "K2",
          description:
            "Pay a deposit of 168,000 BDT, perform 50 tasks per day, earn 120 BDT per task, 6,000 BDT per day, earn 180,000 BDT in 30 days, and 2,160,000 BDT in 360 days.",
        },
        {
          position: "K3",
          description:
            "Pay a deposit of 470,000 BDT, perform 100 tasks per day, earn 170 BDT per task, 17,000 BDT per day, earn 510,000 BDT in 30 days, and 6,120,000 BDT in 360 days.",
        },
      ],
    },

    {
      title: "Senior Positions",
      items: [
        {
          position: "W1",
          description:
            "Pay a deposit of 690,000 BDT, complete 130 tasks per day, earn 200 BDT per task, 26,000 BDT per day, earn 780,000 BDT in 30 days, and earn 9,360,000 BDT in 360 days.",
        },
        {
          position: "W2",
          description:
            "Pay a deposit of 1,380,000 BDT, complete 180 tasks per day, earn 300 BDT per task, earn 54,000 BDT per day, earn 1,620,000 BDT in 30 days, and earn 19,440,000 BDT in 360 days.",
        },
        {
          position: "W3",
          description:
            "Pay a deposit of 2,760,000 BDT, complete 250 tasks per day, earn 450 BDT per task, earn 112,500 BDT per day, earn 3,375,000 BDT in 30 days, and earn 40,500,000 BDT in 360 days.",
        },
      ],
    },

    {
      title: "Corporate Partners",
      items: [
        {
          position: "ukaids",
          description:
            "Pay a deposit of 5,520,000 BDT, 400 tasks per day, earn 600 BDT per task, earn 240,000 BDT per day, earn 7,200,000 BDT in 30 days, and earn 86,400,000 BDT in 360 days.",
        },
      ],
    },
  ];
  const rewards = [
    {
      level: "A1",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "300",
      level2Reward: "90",
    },
    {
      level: "A2",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "840",
      level2Reward: "252",
    },
    {
      level: "A3",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "2350",
      level2Reward: "705",
    },
    {
      level: "K1",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "6000",
      level2Reward: "1800",
    },
    {
      level: "K2",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "16800",
      level2Reward: "5040",
    },
    {
      level: "K3",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "47000",
      level2Reward: "14100",
    },
    {
      level: "W1",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "69000",
      level2Reward: "20700",
    },
    {
      level: "W2",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "138000",
      level2Reward: "41400",
    },
    {
      level: "W3",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "276000",
      level2Reward: "82800",
    },
    {
      level: "ukaids",
      level3Invite: "10%→3%→1%",
      firstLevelReward: "552000",
      level2Reward: "165600",
    },
  ];

  const notes = [
    "If you are A1 and recommend a level 1 subordinate to become A1, you get 300 BDT.",
    "If your level 1 employee recommends a level 2 employee, you get 90 BDT.",
    "If your invited subordinate upgrades, you only get reward matching your level.",
    "Higher your level → higher your rewards.",
    "You cannot get reward higher than your own level.",
  ];
  const taskData = [
    {
      level: "A1",
      taskPercent: "3%→2%→1%",
      aReward: "3",
      bReward: "2",
      cReward: "1",
    },
    {
      level: "A2",
      taskPercent: "3%→2%→1%",
      aReward: "8.4",
      bReward: "5.6",
      cReward: "2.8",
    },
    {
      level: "A3",
      taskPercent: "3%→2%→1%",
      aReward: "24",
      bReward: "16",
      cReward: "8",
    },
    {
      level: "K1",
      taskPercent: "3%→2%→1%",
      aReward: "63",
      bReward: "42",
      cReward: "21",
    },
    {
      level: "K2",
      taskPercent: "3%→2%→1%",
      aReward: "180",
      bReward: "120",
      cReward: "60",
    },
    {
      level: "K3",
      taskPercent: "3%→2%→1%",
      aReward: "510",
      bReward: "340",
      cReward: "170",
    },
    {
      level: "W1",
      taskPercent: "3%→2%→1%",
      aReward: "780",
      bReward: "520",
      cReward: "260",
    },
    {
      level: "W2",
      taskPercent: "3%→2%→1%",
      aReward: "1620",
      bReward: "1080",
      cReward: "540",
    },
    {
      level: "W3",
      taskPercent: "3%→2%→1%",
      aReward: "3375",
      bReward: "2250",
      cReward: "1125",
    },
    {
      level: "ukaids",
      taskPercent: "3%→2%→1%",
      aReward: "7200",
      bReward: "4800",
      cReward: "2400",
    },
  ];

  const taskNotes = [
    "The daily task bonus for a Level 1 subordinate is 3% of daily income. For A3 earning 800 BDT/day: 800×10×3% = 240 BDT.",
    "Level 2 subordinate bonus = 2% of daily income. Example: 800×10×2% = 160 BDT.",
    "Level 3 subordinate bonus = 1% of daily income. Example: 800×10×1% = 80 BDT.",
  ];

  const warnings = [
    "You can get commissions for tasks assigned by employees at or below your level.",
    "If your subordinate's level is higher than yours, you do not get their task commission.",
    "Increase your level to unlock higher commission tiers.",
  ];
  return (
    <div className="w-[360px] min-h-screen mx-auto bg-[#121212] text-white pb-10">
      {/* Hero Section */}
      <UserIntroHero />

      {/* Page Content */}
      <LevelBenefitTable tableData={tableData} />
      <LevelDescriptionList sections={sections} />
      <InvitationRewardTable rewards={rewards} notes={notes} />
      <TaskCommissionTable tableData={taskData} notes={taskNotes} warnings={warnings} />
    </div>
  );
}
