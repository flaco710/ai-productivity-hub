// Estimated minutes a person saves per completed AI task, by tool.
export const MINUTES_SAVED: Record<string, number> = {
  email: 10,
  meeting: 20,
  planner: 15,
  research: 30,
  chat: 5,
};

const KEY = "time-saved-v1";

export type TimeSaved = Record<string, number>; // mode -> task count

export function readTimeSaved(): TimeSaved {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as TimeSaved;
  } catch {
    return {};
  }
}

export function recordTask(mode: string) {
  if (typeof window === "undefined") return;
  const data = readTimeSaved();
  data[mode] = (data[mode] ?? 0) + 1;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function totalMinutes(data: TimeSaved) {
  return Object.entries(data).reduce((s, [m, n]) => s + (MINUTES_SAVED[m] ?? 0) * n, 0);
}
