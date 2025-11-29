import DateRangeSearch from "./components/DateRangeSearch";
import TeamDataOverview from "./components/TeamDataOverview";
import TeamData from "./components/TeamData";
import TeamFeatureImage from "./components/TeamFeatureImage";
import PositionResponsibilities from "./components/PositionResponsibilities";
import PromotionCriteria from "./components/PromotionCriteria";
import JobRequirementsFixedSalaries from "./components/JobRequirementsFixedSalaries";
import TeamPerformanceBonusPolicy from "./components/TeamPerformanceBonusPolicy";

export default function TeamPage() {
  const teamInfo = [
    { title: "Team - 01", registration: 11, percentage: 11, revenue: 11 },
    { title: "Team - 02", registration: 20, percentage: 10, revenue: 15 },
    { title: "Team - 03", registration: 8, percentage: 5, revenue: 6 },
  ];
  const responsibilities = [
    "Establish and manage your own work group, enforcing group rules daily. Take immediate action if any member violates the rules.",
    "Provide daily support to team members by promptly answering questions and resolving work-related issues.",
    "Actively share income updates and work insights in the group daily. Use both text and screenshots to motivate members and showcase success.",
    "Invite Recruitment Managers to join the work group for assistance in management, supervision, and guiding members in claiming work bonuses.",
    "Encourage and supervise top-performing team members to create their own team group, providing guidance on management methods.",
    "Attend scheduled online meetings on time and forward key updates to the group, ensuring all members stay informed about the latest company news."
  ];
   const leftTexts = [
    "Direct subordinates: 15",
    "Direct subordinates: 30",
    "Direct subordinates: 30 – Team members: 150",
    "Direct subordinates: 30 – Team members: 800",
    "Direct subordinates: 30 – Team members: 1,500",
    "Direct subordinates: 30 – Team members: 3,000",
    "Direct subordinates: 30 – Team members: 6,000",
  ];
  const rightTexts = [
    "Trainee Marketing Manager",
    "Full Marketing Manager",
    "Trainee Marketing Director",
    "Trainee Marketing Director",
    "Full Marketing Director",
    "Full HR Director",
    "Chief Marketing Officer (CMO)",
  ]; 

  return (
    <div className="w-full flex flex-col items-center p-4">
      <DateRangeSearch />
      <TeamDataOverview />
      <TeamData items={teamInfo} />
      <TeamFeatureImage />
      <PositionResponsibilities items={responsibilities} />
      <PromotionCriteria leftItems={leftTexts} rightItems={rightTexts} />
      <JobRequirementsFixedSalaries />
      <TeamPerformanceBonusPolicy />
    </div>
  );
}
