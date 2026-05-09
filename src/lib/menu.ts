export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  popular?: boolean;
}

export const MENU_CATEGORIES = ["Burgers", "Chicken", "Sides", "Drinks", "Desserts"] as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "b1",
    name: "Gosto Classic Burger",
    description: "Double beef patty, cheddar, lettuce, tomato, secret sauce",
    price: 850,
    category: "Burgers",
    emoji: "🍔",
    popular: true,
  },
  {
    id: "b2",
    name: "Spicy Inferno Burger",
    description: "Crispy jalapeños, ghost pepper sauce, pepper jack cheese",
    price: 920,
    category: "Burgers",
    emoji: "🌶️",
  },
  {
    id: "b3",
    name: "BBQ Smokehouse Burger",
    description: "Slow-smoked beef, crispy onion rings, BBQ sauce",
    price: 980,
    category: "Burgers",
    emoji: "🔥",
    popular: true,
  },
  {
    id: "b4",
    name: "Mushroom Swiss Burger",
    description: "Sautéed mushrooms, Swiss cheese, garlic mayo",
    price: 890,
    category: "Burgers",
    emoji: "🍄",
  },
  {
    id: "c1",
    name: "Crispy Chicken Sandwich",
    description: "Buttermilk fried chicken, coleslaw, pickles, honey mustard",
    price: 780,
    category: "Chicken",
    emoji: "🍗",
    popular: true,
  },
  {
    id: "c2",
    name: "Chicken Tenders (6pc)",
    description: "Golden crispy tenders served with dipping sauce",
    price: 720,
    category: "Chicken",
    emoji: "🍟",
  },
  {
    id: "c3",
    name: "Grilled Chicken Wrap",
    description: "Grilled chicken, avocado, tomato, ranch in a flour tortilla",
    price: 650,
    category: "Chicken",
    emoji: "🌯",
  },
  {
    id: "s1",
    name: "Loaded Fries",
    description: "Crispy fries topped with cheese sauce, bacon bits, jalapeños",
    price: 380,
    category: "Sides",
    emoji: "🍟",
    popular: true,
  },
  {
    id: "s2",
    name: "Onion Rings",
    description: "Golden battered onion rings with ranch dip",
    price: 320,
    category: "Sides",
    emoji: "🧅",
  },
  {
    id: "s3",
    name: "Coleslaw",
    description: "Creamy homemade coleslaw",
    price: 180,
    category: "Sides",
    emoji: "🥗",
  },
  {
    id: "d1",
    name: "Fresh Lemonade",
    description: "Squeezed fresh with mint leaves",
    price: 220,
    category: "Drinks",
    emoji: "🍋",
  },
  {
    id: "d2",
    name: "Chocolate Milkshake",
    description: "Thick and creamy with whipped cream",
    price: 350,
    category: "Drinks",
    emoji: "🥤",
    popular: true,
  },
  {
    id: "d3",
    name: "Soft Drinks",
    description: "Coca Cola, Fanta, Sprite — your choice",
    price: 150,
    category: "Drinks",
    emoji: "🥫",
  },
  {
    id: "ds1",
    name: "Chocolate Lava Cake",
    description: "Warm molten chocolate cake with vanilla ice cream",
    price: 420,
    category: "Desserts",
    emoji: "🍫",
  },
  {
    id: "ds2",
    name: "Cheesecake Slice",
    description: "NY-style classic cheesecake with berry compote",
    price: 380,
    category: "Desserts",
    emoji: "🍰",
  },
];
