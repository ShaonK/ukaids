"use client";

import HeaderButtons from "./components/HeaderButtons";
import EarningsSummary from "./components/EarningsSummary";
import TaskProgress from "./components/TaskProgress";
import AssignmentNotice from "./components/AssignmentNotice";

export default function GetPage() {

  // 🔥 Dummy data (After API replace these)
  const dashboardData = {
    todayEarnings: 0,
    accountBalance: 0,
    completedTasks: 0,
    totalTasks: 5,
    workDays: "Monday to Sunday",
    workHours: "Monday to Saturday, 12:01 AM to 11:59 PM",
    contact: "Hiring Manager",
  };

  return (
    <div className="w-full">

      <HeaderButtons startLabel="Start" taskListLabel="Task List" />

      <EarningsSummary
        todayEarnings={dashboardData.todayEarnings}
        accountBalance={dashboardData.accountBalance}
      />

      <TaskProgress
        completed={dashboardData.completedTasks}
        total={dashboardData.totalTasks}
        onStart={() => console.log("Start Now Clicked")}
      />

      <AssignmentNotice
        workDays={dashboardData.workDays}
        workHours={dashboardData.workHours}
        contact={dashboardData.contact}
      />

    </div>
  );
}
