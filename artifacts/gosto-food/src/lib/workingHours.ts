import { useEffect, useState } from "react";

export interface TimeSlot {
  open: string;
  close: string;
}

export interface DaySchedule {
  isOpen: boolean;
  slots: TimeSlot[];
}

const SLOTS: TimeSlot[] = [
  { open: "10:00", close: "15:00" },
  { open: "17:00", close: "22:00" },
];

export const WORKING_HOURS: Record<number, DaySchedule> = {
  0: { isOpen: true, slots: SLOTS },
  1: { isOpen: true, slots: SLOTS },
  2: { isOpen: true, slots: SLOTS },
  3: { isOpen: true, slots: SLOTS },
  4: { isOpen: true, slots: SLOTS },
  5: { isOpen: false, slots: [] },
  6: { isOpen: true, slots: SLOTS },
};

export const DAY_NAMES_FR = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export const DAY_NAMES_AR = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

const TIMEZONE = "Africa/Algiers";

interface CurrentTime {
  day: number;
  minutes: number;
  hhmm: string;
}

function getAlgiersTime(date: Date = new Date()): CurrentTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return {
    day: weekdayMap[weekday] ?? 0,
    minutes: hour * 60 + minute,
    hhmm: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface OpenStatus {
  isOpen: boolean;
  currentTime: string;
  todayLabelFr: string;
  todayLabelAr: string;
  todaySlots: TimeSlot[];
  nextOpenLabel?: string;
}

export function getOpenStatus(date: Date = new Date()): OpenStatus {
  const { day, minutes, hhmm } = getAlgiersTime(date);
  const today = WORKING_HOURS[day];

  let isOpen = false;
  if (today?.isOpen) {
    for (const slot of today.slots) {
      if (minutes >= toMinutes(slot.open) && minutes < toMinutes(slot.close)) {
        isOpen = true;
        break;
      }
    }
  }

  let nextOpenLabel: string | undefined;
  if (!isOpen) {
    if (today?.isOpen) {
      const upcoming = today.slots.find((s) => minutes < toMinutes(s.open));
      if (upcoming) {
        nextOpenLabel = `Aujourd'hui à ${upcoming.open}`;
      }
    }
    if (!nextOpenLabel) {
      for (let i = 1; i <= 7; i++) {
        const nextDay = (day + i) % 7;
        const sched = WORKING_HOURS[nextDay];
        if (sched?.isOpen && sched.slots.length > 0) {
          nextOpenLabel = `${DAY_NAMES_FR[nextDay]} à ${sched.slots[0].open}`;
          break;
        }
      }
    }
  }

  return {
    isOpen,
    currentTime: hhmm,
    todayLabelFr: DAY_NAMES_FR[day],
    todayLabelAr: DAY_NAMES_AR[day],
    todaySlots: today?.slots ?? [],
    nextOpenLabel,
  };
}

export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>(() => getOpenStatus());

  useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus()), 30_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
