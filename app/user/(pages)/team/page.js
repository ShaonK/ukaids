export const dynamic = "force-dynamic";

import { getUser } from "@/lib/getUser";
import { getTeamData } from "@/lib/teamService";

import TeamSummary from "./components/TeamSummary";
import GenerationTabs from "./components/GenerationTabs";
import InactiveTeamList from "./components/InactiveTeamList";
import TeamIncomeGuide from "./components/TeamIncomeGuide";

export default async function TeamPage() {
  const user = await getUser();
  if (!user) return null;

  const { team, generations, totalTeamCount } =
    await getTeamData(user.id);

  /**
   * 🔹 SAFE generation counts
   * - Dynamic generations supported
   * - No undefined.length error
   */
  const generationCounts = Object.fromEntries(
    Object.entries(generations).map(
      ([gen, users]) => [gen, users.length]
    )
  );

  return (
    <div className="w-full px-4 pb-24 text-white">
      {/* 🔹 TEAM SUMMARY */}
      <TeamSummary
        data={team}
        totalTeam={totalTeamCount}
      />

      {/* 🔹 GENERATION TABS + USER LIST */}
      <GenerationTabs
        team={team}
        counts={generationCounts}
      />

      {/* 🔹 INACTIVE USERS */}
      <InactiveTeamList
        users={team.filter((u) => !u.isActive)}
      />

      {/* 🔹 GUIDE */}
      <TeamIncomeGuide />
    </div>
  );
}
