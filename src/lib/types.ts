export type MemberRole = "adult" | "kid";

export type Member = {
  id: string;
  name: string;
  color: string;
  role: MemberRole;
};

export type CalendarEvent = {
  id: string;
  title: string;
  memberIds: string[];
  date: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  location: string;
  notes: string;
  /** Weekdays this repeats on, 0 = Sunday through 6 = Saturday. Empty means one-time. */
  repeatDays: number[];
};

export type MealSlot = "breakfast" | "lunch" | "dinner";

export type Meal = {
  id: string;
  date: string;
  slot: MealSlot;
  title: string;
  notes: string;
  recipeId: string;
  protein: string;
  starch: string;
  vegetable: string;
  minutes: number;
};

export type ShoppingItem = {
  id: string;
  name: string;
  qty: string;
  checked: boolean;
};

export type ResearchStatus = "inbox" | "looking" | "done";

export type ResearchItem = {
  id: string;
  title: string;
  notes: string;
  status: ResearchStatus;
  createdAt: string;
};

export type Household = {
  name: string;
  pinHash: string;
  pinSalt: string;
};

export type Database = {
  household: Household | null;
  members: Member[];
  events: CalendarEvent[];
  meals: Meal[];
  shopping: ShoppingItem[];
  research: ResearchItem[];
  appleCalendarUrl: string;
};

export type PublicState = {
  householdName: string;
  members: Member[];
  events: CalendarEvent[];
  meals: Meal[];
  shopping: ShoppingItem[];
  research: ResearchItem[];
  appleCalendarUrl: string;
};

export type Action =
  | { type: "addMember"; name: string; color: string; role: MemberRole }
  | { type: "updateMember"; id: string; name: string; color: string; role: MemberRole }
  | { type: "removeMember"; id: string }
  | { type: "addEvent"; event: Omit<CalendarEvent, "id"> }
  | { type: "updateEvent"; id: string; event: Omit<CalendarEvent, "id"> }
  | { type: "removeEvent"; id: string }
  | { type: "addMeal"; meal: Omit<Meal, "id"> }
  | { type: "updateMeal"; id: string; meal: Omit<Meal, "id"> }
  | { type: "removeMeal"; id: string }
  | { type: "planDinners"; meals: Omit<Meal, "id">[] }
  | { type: "addShoppingItems"; items: { name: string; qty: string }[] }
  | { type: "addShopping"; name: string; qty: string }
  | { type: "updateShopping"; id: string; name: string; qty: string }
  | { type: "toggleShopping"; id: string }
  | { type: "removeShopping"; id: string }
  | { type: "clearCheckedShopping" }
  | { type: "addResearch"; title: string; notes: string }
  | { type: "updateResearch"; id: string; title: string; notes: string; status: ResearchStatus }
  | { type: "removeResearch"; id: string }
  | { type: "renameHousehold"; name: string }
  | { type: "setAppleCalendarUrl"; url: string };

export const MEMBER_COLORS = [
  "#C45C26",
  "#4F6F5C",
  "#3D5A80",
  "#B56576",
  "#C9A227",
  "#6B4C7A",
  "#2A9D8F",
  "#E76F51",
];
