"use client";

export default function AssignmentNotice({
  workDays = "Monday to Sunday",
  workHours = "Monday to Saturday, 12:01 AM to 11:59 PM",
  contact = "Hiring Manager",
}) {
  return (
    <div className="text-white px-4 mt-6 text-[13px] leading-relaxed">
      <p className="font-semibold">Assignment Notification</p>
      <p>Intern: {workDays}</p>
      <p>Contract Work Hours: {workHours}</p>
      <p className="mt-2">
        For further assistance, please contact the {contact}.
      </p>
    </div>
  );
}
