"use client";

import { useEffect, useState } from "react";
import TeamSummary from "./components/TeamSummary";
import GenerationTabs from "./components/GenerationTabs";
import GenerationUserList from "./components/GenerationUserList";
import InactiveTeamList from "./components/InactiveTeamList";
import TeamIncomeGuide from "./components/TeamIncomeGuide";

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [totalTeam, setTotalTeam] = useState(0);
  const [generation, setGeneration] = useState(1);

  useEffect(() => {
    fetch("/api/user/team")
      .then((res) => res.json())
      .then((data) => {
        setTeam(data.team || []);
        setTotalTeam(data.totalTeamCount || 0);
      });
  }, []);

  const genUsers = team.filter((u) => u.generation === generation);
  const inactive = team.filter((u) => !u.isActive);

  return (
    <div className="w-full px-4 pb-24 text-white">
      <TeamSummary data={team} totalTeam={totalTeam} />

      <GenerationTabs active={generation} onChange={setGeneration} />

      <GenerationUserList users={genUsers} generation={generation} />

      <InactiveTeamList users={inactive} />

      <TeamIncomeGuide />
    </div>
  );
}
