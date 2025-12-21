export const dynamic = "force-dynamic";

import { getUser } from "@/lib/getUser";
import { getTeamData } from "@/lib/teamService";

import TeamSummary from "./components/TeamSummary";
import GenerationTabs from "./components/GenerationTabs";
import InactiveTeamList from "./components/InactiveTeamList";
import TeamIncomeGuide from "./components/TeamIncomeGuide";

export default async function TeamPage() {
  const user = await getUser(); // uses cookies → OK now
  if (!user) return null;

  const { team, generations, totalTeamCount } =
    await getTeamData(user.id);

  const generationCounts = {
    1: generations[1].length,
    2: generations[2].length,
    3: generations[3].length,
    4: generations[4].length,
    5: generations[5].length,
  };

  return (
    <div className="w-full px-4 pb-24 text-white">
      <TeamSummary data={team} totalTeam={totalTeamCount} />

      <GenerationTabs team={team} counts={generationCounts} />

      <InactiveTeamList users={team.filter((u) => !u.isActive)} />

      <TeamIncomeGuide />
    </div>
  );
}
