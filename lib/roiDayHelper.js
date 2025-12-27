import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getDayInfo(timezoneStr = "UTC") {
  const now = dayjs().tz(timezoneStr);
  const dayShort = now.format("ddd"); // Mon, Tue, Sat
  const midnight = now.startOf("day").valueOf();
  const nextMidnight = now.add(1, "day").startOf("day").valueOf();

  return { dayShort, midnight, nextMidnight };
}
