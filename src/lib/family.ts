import type { Member, MemberRole } from "./types";

export const FAMILY_MEMBERS: { name: string; role: MemberRole }[] = [
  { name: "Mom", role: "adult" },
  { name: "Dad", role: "adult" },
  { name: "Giada", role: "kid" },
  { name: "Luca", role: "kid" },
  { name: "Nico", role: "kid" },
];

export type EventPreset = {
  title: string;
  startTime: string;
  endTime: string;
  who: string[];
};

export const EVENT_PRESETS: EventPreset[] = [
  {
    title: "Swim team practice",
    startTime: "16:30",
    endTime: "17:30",
    who: [],
  },
  {
    title: "Soccer practice",
    startTime: "17:00",
    endTime: "18:00",
    who: [],
  },
  {
    title: "Football practice",
    startTime: "17:30",
    endTime: "18:30",
    who: [],
  },
  {
    title: "Girl Scout meeting",
    startTime: "18:00",
    endTime: "19:00",
    who: ["Giada"],
  },
  {
    title: "Doctor appointment",
    startTime: "10:00",
    endTime: "10:30",
    who: [],
  },
  {
    title: "Birthday party",
    startTime: "14:00",
    endTime: "16:00",
    who: [],
  },
];

export function memberIdsForNames(members: Member[], names: string[]): string[] {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  return members
    .filter((member) => wanted.has(member.name.toLowerCase()))
    .map((member) => member.id);
}
