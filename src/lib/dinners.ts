import type { Meal } from "./types";

export type GroceryItem = {
  name: string;
  qty: string;
};

export type DinnerRecipe = {
  id: string;
  title: string;
  minutes: number;
  proteinKind: string;
  protein: string;
  starch: string;
  vegetable: string;
  how: string[];
  grocery: GroceryItem[];
};

/** Weeknight dinners for a family of 5. Each plate is protein + starch + vegetable, about 20–35 minutes. */
export const DINNERS: DinnerRecipe[] = [
  {
    id: "sheet-pan-chicken",
    title: "Sheet-pan chicken",
    minutes: 30,
    proteinKind: "chicken",
    protein: "Chicken thighs",
    starch: "Baby potatoes",
    vegetable: "Broccoli",
    how: [
      "Heat oven to 425°. Toss 3 lb chicken thighs and 2 lb baby potatoes with olive oil, salt, garlic, and paprika.",
      "Roast 20 minutes. Add 2 bags broccoli florets, toss, roast 10 more minutes until chicken is cooked.",
    ],
    grocery: [
      { name: "Chicken thighs", qty: "3 lb" },
      { name: "Baby potatoes", qty: "2 lb" },
      { name: "Broccoli florets", qty: "2 bags" },
      { name: "Garlic", qty: "1 head" },
    ],
  },
  {
    id: "turkey-taco-bowls",
    title: "Turkey taco bowls",
    minutes: 25,
    proteinKind: "turkey",
    protein: "Ground turkey",
    starch: "Rice",
    vegetable: "Peppers and corn",
    how: [
      "Start 2 cups rice. Brown 2 lb ground turkey with taco seasoning.",
      "Sauté sliced peppers and a bag of frozen corn. Bowl it up with turkey, rice, salsa, and a little cheese.",
    ],
    grocery: [
      { name: "Ground turkey", qty: "2 lb" },
      { name: "Rice", qty: "2 cups dry" },
      { name: "Bell peppers", qty: "3" },
      { name: "Frozen corn", qty: "1 bag" },
      { name: "Taco seasoning", qty: "1 packet" },
      { name: "Salsa", qty: "1 jar" },
    ],
  },
  {
    id: "chicken-quinoa-beans",
    title: "Lemon chicken and quinoa",
    minutes: 25,
    proteinKind: "chicken",
    protein: "Chicken breasts",
    starch: "Quinoa",
    vegetable: "Green beans",
    how: [
      "Oven to 400°. Start quinoa (2 cups dry). Roast 2.5 lb chicken with lemon, olive oil, and salt for 20–25 minutes.",
      "Steam or sauté 2 lb green beans with garlic while the chicken cooks.",
    ],
    grocery: [
      { name: "Chicken breasts", qty: "2.5 lb" },
      { name: "Quinoa", qty: "2 cups dry" },
      { name: "Green beans", qty: "2 lb" },
      { name: "Lemons", qty: "2" },
    ],
  },
  {
    id: "beef-broccoli-rice",
    title: "Beef and broccoli",
    minutes: 25,
    proteinKind: "beef",
    protein: "Sirloin or flank steak",
    starch: "Brown rice",
    vegetable: "Broccoli",
    how: [
      "Start rice. Slice 2 lb steak thin. Stir-fry beef in a hot pan, set aside.",
      "Stir-fry 2 bags broccoli, add beef back with a mix of soy sauce, garlic, and a little honey. Serve over rice.",
    ],
    grocery: [
      { name: "Flank or sirloin steak", qty: "2 lb" },
      { name: "Brown rice", qty: "2 cups dry" },
      { name: "Broccoli florets", qty: "2 bags" },
      { name: "Soy sauce", qty: "1 bottle" },
    ],
  },
  {
    id: "greek-chicken-orzo",
    title: "Greek chicken and orzo",
    minutes: 30,
    proteinKind: "chicken",
    protein: "Chicken breasts",
    starch: "Orzo",
    vegetable: "Cucumber tomato salad",
    how: [
      "Cook orzo. Pan-cook 2.5 lb chicken with oregano, lemon, and olive oil.",
      "Chop cucumber, tomatoes, and red onion with olive oil and lemon. Serve chicken over orzo with the salad.",
    ],
    grocery: [
      { name: "Chicken breasts", qty: "2.5 lb" },
      { name: "Orzo", qty: "1 lb" },
      { name: "Cucumbers", qty: "2" },
      { name: "Tomatoes", qty: "4" },
      { name: "Red onion", qty: "1" },
      { name: "Lemons", qty: "2" },
    ],
  },
  {
    id: "garlic-chicken-couscous",
    title: "Garlic chicken and couscous",
    minutes: 20,
    proteinKind: "chicken",
    protein: "Chicken breasts",
    starch: "Couscous",
    vegetable: "Zucchini",
    how: [
      "Pour boiling water over couscous, cover 5 minutes. Sauté sliced zucchini.",
      "Slice 2.5 lb chicken and cook in olive oil, garlic, and lemon until done, about 8 minutes. Pile on couscous with zucchini.",
    ],
    grocery: [
      { name: "Chicken breasts", qty: "2.5 lb" },
      { name: "Couscous", qty: "1 box" },
      { name: "Zucchini", qty: "4" },
      { name: "Garlic", qty: "1 head" },
      { name: "Lemons", qty: "2" },
    ],
  },
  {
    id: "turkey-meatball-pasta",
    title: "Turkey meatballs and pasta",
    minutes: 30,
    proteinKind: "turkey",
    protein: "Turkey meatballs",
    starch: "Whole-wheat pasta",
    vegetable: "Side salad",
    how: [
      "Boil pasta. Mix 2 lb turkey with an egg, breadcrumbs, and Italian seasoning; roll and brown in a pan, then simmer in jarred marinara.",
      "Toss a bagged salad with olive oil and vinegar. Serve meatballs over pasta with salad on the side.",
    ],
    grocery: [
      { name: "Ground turkey", qty: "2 lb" },
      { name: "Whole-wheat pasta", qty: "1.5 lb" },
      { name: "Marinara sauce", qty: "1 jar" },
      { name: "Breadcrumbs", qty: "1 canister" },
      { name: "Eggs", qty: "1 dozen" },
      { name: "Bagged salad", qty: "2 bags" },
    ],
  },
  {
    id: "pork-sweet-potato",
    title: "Pork and sweet potatoes",
    minutes: 30,
    proteinKind: "pork",
    protein: "Pork tenderloin",
    starch: "Sweet potatoes",
    vegetable: "Asparagus",
    how: [
      "Oven to 425°. Cube 3 lb sweet potatoes, roast 15 minutes. Add 2 pork tenderloins (oil, salt, pepper) and a bunch of asparagus.",
      "Roast 15 more minutes until pork hits 145°. Rest 5 minutes, slice, and serve.",
    ],
    grocery: [
      { name: "Pork tenderloin", qty: "2" },
      { name: "Sweet potatoes", qty: "3 lb" },
      { name: "Asparagus", qty: "2 bunches" },
    ],
  },
  {
    id: "sausage-peppers-potatoes",
    title: "Chicken sausage tray bake",
    minutes: 30,
    proteinKind: "chicken",
    protein: "Chicken sausage",
    starch: "Baby potatoes",
    vegetable: "Peppers and onions",
    how: [
      "Oven to 425°. Halve 2 lb potatoes, slice 4 peppers and 2 onions, toss with oil and salt.",
      "Add sliced chicken sausage. Roast 25–30 minutes, stirring once.",
    ],
    grocery: [
      { name: "Chicken sausage", qty: "2 lb" },
      { name: "Baby potatoes", qty: "2 lb" },
      { name: "Bell peppers", qty: "4" },
      { name: "Onions", qty: "2" },
    ],
  },
  {
    id: "chicken-tacos",
    title: "Chicken taco night",
    minutes: 25,
    proteinKind: "chicken",
    protein: "Chicken",
    starch: "Corn tortillas",
    vegetable: "Cabbage slaw",
    how: [
      "Toss shredded cabbage with lime, a spoon of yogurt, and salt. Warm tortillas.",
      "Season 2.5 lb sliced chicken with chili powder and salt. Cook in a hot pan until done. Build tacos with slaw.",
    ],
    grocery: [
      { name: "Chicken breasts", qty: "2.5 lb" },
      { name: "Corn tortillas", qty: "2 packs" },
      { name: "Shredded cabbage", qty: "1 bag" },
      { name: "Limes", qty: "4" },
      { name: "Plain yogurt", qty: "1 tub" },
    ],
  },
  {
    id: "lemon-chicken-spinach",
    title: "Lemon chicken skillet",
    minutes: 25,
    proteinKind: "chicken",
    protein: "Chicken breasts",
    starch: "Rice",
    vegetable: "Spinach",
    how: [
      "Start rice. Slice 2.5 lb chicken and cook in a skillet with olive oil, garlic, and lemon.",
      "Wilt in 2 bags of spinach at the end. Serve over rice with the pan juices.",
    ],
    grocery: [
      { name: "Chicken breasts", qty: "2.5 lb" },
      { name: "Rice", qty: "2 cups dry" },
      { name: "Baby spinach", qty: "2 bags" },
      { name: "Lemons", qty: "2" },
      { name: "Garlic", qty: "1 head" },
    ],
  },
  {
    id: "honey-mustard-chicken",
    title: "Honey mustard chicken",
    minutes: 35,
    proteinKind: "chicken",
    protein: "Chicken thighs",
    starch: "Mashed potatoes",
    vegetable: "Roasted carrots",
    how: [
      "Oven to 400°. Coat 3 lb chicken thighs with honey and mustard; roast 30 minutes.",
      "Roast a bag of carrots on the same sheet. Boil and mash 3 lb potatoes with a splash of milk.",
    ],
    grocery: [
      { name: "Chicken thighs", qty: "3 lb" },
      { name: "Potatoes", qty: "3 lb" },
      { name: "Baby carrots", qty: "2 lb" },
      { name: "Dijon mustard", qty: "1 jar" },
      { name: "Honey", qty: "1 bottle" },
      { name: "Milk", qty: "1 half-gallon" },
    ],
  },
  {
    id: "black-bean-bowls",
    title: "Black bean burrito bowls",
    minutes: 25,
    proteinKind: "beans",
    protein: "Black beans",
    starch: "Rice",
    vegetable: "Fajita peppers",
    how: [
      "Cook rice. Warm 2 cans black beans with cumin and garlic.",
      "Sauté peppers and onions. Bowls: rice, beans, peppers, salsa, and a little cheese or avocado.",
    ],
    grocery: [
      { name: "Black beans", qty: "2 cans" },
      { name: "Rice", qty: "2 cups dry" },
      { name: "Bell peppers", qty: "3" },
      { name: "Onion", qty: "1" },
      { name: "Salsa", qty: "1 jar" },
      { name: "Avocados", qty: "3" },
    ],
  },
  {
    id: "teriyaki-chicken",
    title: "Teriyaki chicken",
    minutes: 25,
    proteinKind: "chicken",
    protein: "Chicken thighs",
    starch: "Rice",
    vegetable: "Broccoli",
    how: [
      "Start rice. Bake 3 lb chicken thighs at 400° for 25 minutes; brush with teriyaki in the last 5 minutes.",
      "Steam 2 bags broccoli. Serve chicken and broccoli over rice.",
    ],
    grocery: [
      { name: "Chicken thighs", qty: "3 lb" },
      { name: "Rice", qty: "2 cups dry" },
      { name: "Broccoli florets", qty: "2 bags" },
      { name: "Teriyaki sauce", qty: "1 bottle" },
    ],
  },
  {
    id: "turkey-zucchini-skillet",
    title: "Turkey veggie skillet",
    minutes: 25,
    proteinKind: "turkey",
    protein: "Ground turkey",
    starch: "Rice",
    vegetable: "Zucchini and tomatoes",
    how: [
      "Start rice. Brown 2 lb turkey. Add chopped zucchini and a pint of cherry tomatoes; cook until soft.",
      "Season with Italian herbs and serve over rice.",
    ],
    grocery: [
      { name: "Ground turkey", qty: "2 lb" },
      { name: "Rice", qty: "2 cups dry" },
      { name: "Zucchini", qty: "3" },
      { name: "Cherry tomatoes", qty: "1 pint" },
    ],
  },
  {
    id: "steak-night",
    title: "Steak night",
    minutes: 30,
    proteinKind: "beef",
    protein: "Sirloin steak",
    starch: "Baked potatoes",
    vegetable: "Green beans",
    how: [
      "Oven to 425°. Scrub 5 potatoes, poke with a fork, and bake 30 minutes. Steam 2 lb green beans.",
      "Salt 2.5 lb sirloin. Sear in a hot pan 4–5 minutes a side for medium. Rest 5 minutes, slice, and serve.",
    ],
    grocery: [
      { name: "Sirloin steak", qty: "2.5 lb" },
      { name: "Baking potatoes", qty: "5" },
      { name: "Green beans", qty: "2 lb" },
    ],
  },
  {
    id: "steak-fajitas",
    title: "Steak fajitas",
    minutes: 25,
    proteinKind: "beef",
    protein: "Flank steak",
    starch: "Warm tortillas",
    vegetable: "Peppers and onions",
    how: [
      "Slice 2 lb flank steak thin. Cook in a hot pan with chili powder and cumin; set aside.",
      "Sauté 4 peppers and 2 onions. Warm tortillas and pile on steak and peppers.",
    ],
    grocery: [
      { name: "Flank steak", qty: "2 lb" },
      { name: "Flour tortillas", qty: "2 packs" },
      { name: "Bell peppers", qty: "4" },
      { name: "Onions", qty: "2" },
    ],
  },
  {
    id: "burger-night",
    title: "Burger night",
    minutes: 30,
    proteinKind: "beef",
    protein: "Beef burgers",
    starch: "Oven fries",
    vegetable: "Side salad",
    how: [
      "Oven to 425°. Toss 2 lb frozen fries (or sliced potatoes) with oil and salt; bake 25 minutes.",
      "Make 5 patties from 2 lb ground beef. Cook 4–5 minutes a side. Serve on buns with bagged salad.",
    ],
    grocery: [
      { name: "Ground beef", qty: "2 lb" },
      { name: "Hamburger buns", qty: "1 pack" },
      { name: "Frozen fries", qty: "2 lb" },
      { name: "Bagged salad", qty: "2 bags" },
    ],
  },
  {
    id: "spaghetti-bolognese",
    title: "Spaghetti Bolognese",
    minutes: 30,
    proteinKind: "beef",
    protein: "Meat sauce",
    starch: "Spaghetti",
    vegetable: "Side salad",
    how: [
      "Boil spaghetti. Brown 2 lb ground beef with garlic and Italian seasoning; stir in a jar of marinara and simmer 10 minutes.",
      "Toss bagged salad with olive oil and vinegar. Serve sauce over pasta with salad on the side.",
    ],
    grocery: [
      { name: "Ground beef", qty: "2 lb" },
      { name: "Spaghetti", qty: "1.5 lb" },
      { name: "Marinara sauce", qty: "1 jar" },
      { name: "Garlic", qty: "1 head" },
      { name: "Bagged salad", qty: "2 bags" },
    ],
  },
  {
    id: "chicken-parmesan",
    title: "Chicken Parmesan",
    minutes: 35,
    proteinKind: "chicken",
    protein: "Chicken Parmesan",
    starch: "Pasta",
    vegetable: "Broccoli",
    how: [
      "Oven to 425°. Pound 2.5 lb chicken, coat with breadcrumbs, and bake 15 minutes. Spoon marinara and mozzarella on top; bake 10 more minutes.",
      "Boil pasta and steam 2 bags broccoli while the chicken finishes.",
    ],
    grocery: [
      { name: "Chicken breasts", qty: "2.5 lb" },
      { name: "Pasta", qty: "1.5 lb" },
      { name: "Marinara sauce", qty: "1 jar" },
      { name: "Mozzarella", qty: "1 bag shredded" },
      { name: "Breadcrumbs", qty: "1 canister" },
      { name: "Broccoli florets", qty: "2 bags" },
    ],
  },
  {
    id: "sausage-gnocchi",
    title: "Sausage and gnocchi",
    minutes: 25,
    proteinKind: "pork",
    protein: "Italian sausage",
    starch: "Gnocchi",
    vegetable: "Spinach",
    how: [
      "Brown 2 lb Italian sausage, breaking it up. Add a pint of cherry tomatoes.",
      "Boil shelf-stable gnocchi 2–3 minutes, then toss in the pan with 2 bags spinach until wilted.",
    ],
    grocery: [
      { name: "Italian sausage", qty: "2 lb" },
      { name: "Potato gnocchi", qty: "2 packages" },
      { name: "Cherry tomatoes", qty: "1 pint" },
      { name: "Baby spinach", qty: "2 bags" },
    ],
  },
  {
    id: "baked-ziti",
    title: "Baked ziti",
    minutes: 35,
    proteinKind: "beef",
    protein: "Ground beef",
    starch: "Ziti",
    vegetable: "Side salad",
    how: [
      "Boil ziti. Brown 2 lb ground beef; stir in marinara. Mix pasta, sauce, and a handful of mozzarella in a pan.",
      "Bake at 400° for 15 minutes. Serve with bagged salad.",
    ],
    grocery: [
      { name: "Ground beef", qty: "2 lb" },
      { name: "Ziti or penne", qty: "1.5 lb" },
      { name: "Marinara sauce", qty: "1 jar" },
      { name: "Mozzarella", qty: "1 bag shredded" },
      { name: "Bagged salad", qty: "2 bags" },
    ],
  },
  {
    id: "pesto-chicken-pasta",
    title: "Pesto chicken pasta",
    minutes: 25,
    proteinKind: "chicken",
    protein: "Chicken",
    starch: "Pasta",
    vegetable: "Broccoli",
    how: [
      "Boil pasta; in the last 3 minutes add 2 bags broccoli florets to the same pot, then drain.",
      "Cook 2.5 lb sliced chicken in a pan. Toss pasta, broccoli, and chicken with a jar of pesto.",
    ],
    grocery: [
      { name: "Chicken breasts", qty: "2.5 lb" },
      { name: "Pasta", qty: "1.5 lb" },
      { name: "Pesto", qty: "1 jar" },
      { name: "Broccoli florets", qty: "2 bags" },
    ],
  },
];

export function dinnerById(id: string): DinnerRecipe | undefined {
  return DINNERS.find((dinner) => dinner.id === id);
}

export function pickWeekDinners(weekStartKey: string): DinnerRecipe[] {
  const start = Math.abs(
    [...weekStartKey].reduce((sum, char) => sum + char.charCodeAt(0), 0),
  ) % DINNERS.length;
  return Array.from({ length: 7 }, (_, index) => DINNERS[(start + index) % DINNERS.length]);
}

export function mergeGroceries(recipes: DinnerRecipe[]): GroceryItem[] {
  const map = new Map<string, GroceryItem>();
  for (const recipe of recipes) {
    for (const item of recipe.grocery) {
      const key = item.name.toLowerCase();
      if (!map.has(key)) map.set(key, item);
    }
  }
  return [...map.values()];
}

export function mealFromRecipe(date: string, recipe: DinnerRecipe): Omit<Meal, "id"> {
  return {
    date,
    slot: "dinner",
    title: recipe.title,
    notes: recipe.how.join(" "),
    recipeId: recipe.id,
    protein: recipe.protein,
    starch: recipe.starch,
    vegetable: recipe.vegetable,
    minutes: recipe.minutes,
  };
}
