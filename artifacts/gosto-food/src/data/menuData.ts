export interface MenuItemSize {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameAr?: string;
  price?: number;
  sizes?: MenuItemSize[];
  popular?: boolean;
  note?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  accent: string;
  glow: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "pizza",
    name: "Pizza",
    nameAr: "بيتزا",
    icon: "pizza",
    accent: "#FF7A00",
    glow: "rgba(255,122,0,0.35)",
    items: [
      { id: "pz-fromage", name: "Pizza Fromage", nameAr: "بيتزا فرماج", sizes: [{ label: "XL", price: 700 }, { label: "XXL", price: 1000 }] },
      { id: "pz-poulet", name: "Pizza Poulet", nameAr: "بيتزا بولي", sizes: [{ label: "XL", price: 800 }, { label: "XXL", price: 1100 }] },
      { id: "pz-mix", name: "Pizza Mixte", nameAr: "بيتزا ميكس", sizes: [{ label: "XL", price: 900 }, { label: "XXL", price: 1300 }] },
      { id: "pz-3f", name: "Pizza 3 Fromages", nameAr: "3 فرماج", sizes: [{ label: "XL", price: 1000 }, { label: "XXL", price: 1500 }], popular: true },
      { id: "pz-4f", name: "Pizza 4 Fromages", nameAr: "4 فرماج", sizes: [{ label: "XL", price: 1200 }, { label: "XXL", price: 1800 }], popular: true },
      { id: "pz-nat", name: "Nationale Spéciale", nameAr: "ناسيونال سبيسيال", sizes: [{ label: "XL", price: 1400 }, { label: "XXL", price: 2000 }] },
      { id: "pz-gusto", name: "Pizza GOSTO", nameAr: "بيتزا قوستو", sizes: [{ label: "XL", price: 1500 }, { label: "XXL", price: 1950 }], popular: true },
      { id: "pz-super-fond", name: "Super Fondu", nameAr: "سوبر فوند", sizes: [{ label: "XL", price: 900 }, { label: "XXL", price: 1200 }] },
      { id: "pz-super-kid", name: "Super Kebda", nameAr: "سوبر كيدة", sizes: [{ label: "XL", price: 900 }, { label: "XXL", price: 1200 }] },
    ],
  },
  {
    id: "calzone",
    name: "Calzone",
    nameAr: "كالزون",
    icon: "layers",
    accent: "#FF4500",
    glow: "rgba(255,69,0,0.35)",
    items: [
      { id: "cz-poulet", name: "Calzone Poulet", nameAr: "كالزون بولي", sizes: [{ label: "XL", price: 700 }, { label: "XXL", price: 1000 }] },
      { id: "cz-fond", name: "Calzone Fondu", nameAr: "كالزون فوند", sizes: [{ label: "XL", price: 800 }, { label: "XXL", price: 1100 }] },
      { id: "cz-3f", name: "Calzone 3 Fromages", nameAr: "كالزون 3 فرماج", sizes: [{ label: "XL", price: 900 }, { label: "XXL", price: 1300 }], popular: true },
      { id: "cz-4f", name: "Calzone 4 Fromages", nameAr: "كالزون 4 فرماج", sizes: [{ label: "XL", price: 1000 }, { label: "XXL", price: 1400 }] },
    ],
  },
  {
    id: "bateau",
    name: "Bateau",
    nameAr: "باطو",
    icon: "ship",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.3)",
    items: [
      { id: "bt-poulet", name: "Bateau Poulet", nameAr: "باطو بولي", sizes: [{ label: "XL", price: 500 }, { label: "XXL", price: 700 }] },
      { id: "bt-fond", name: "Bateau Fondu", nameAr: "باطو فوند", sizes: [{ label: "XL", price: 600 }, { label: "XXL", price: 800 }] },
      { id: "bt-mix", name: "Bateau Mix", nameAr: "باطو ميكس", sizes: [{ label: "XL", price: 700 }, { label: "XXL", price: 900 }] },
    ],
  },
  {
    id: "tacos",
    name: "Tacos",
    nameAr: "طاكوس",
    icon: "flame",
    accent: "#39FF14",
    glow: "rgba(57,255,20,0.3)",
    items: [
      { id: "tc-arabi", name: "Tacos Arabi", nameAr: "طاكوس عربي", sizes: [{ label: "XS", price: 400 }, { label: "L", price: 800 }] },
      { id: "tc-gratin", name: "Tacos Gratin", nameAr: "طاكوس غراتان", sizes: [{ label: "XS", price: 500 }, { label: "L", price: 1000 }] },
      { id: "tc-3f", name: "Tacos 3 Fromages", nameAr: "طاكوس 3 فرماج", sizes: [{ label: "XS", price: 500 }, { label: "L", price: 1100 }], popular: true },
      { id: "tc-4f", name: "Tacos 4 Fromages", nameAr: "طاكوس 4 فرماج", sizes: [{ label: "XS", price: 600 }, { label: "L", price: 1200 }], popular: true },
      { id: "tc-grizly", name: "Tacos Grizly", nameAr: "طاكوس غريزلي", sizes: [{ label: "XS", price: 600 }, { label: "L", price: 1200 }] },
      { id: "tc-saispal", name: "Tacos Saispal", nameAr: "طاكوس سيسبال", sizes: [{ label: "XS", price: 550 }, { label: "L", price: 1100 }] },
      { id: "tc-campe", name: "Tacos Campé", nameAr: "طاكوس كامبي", sizes: [{ label: "XS", price: 550 }, { label: "L", price: 1100 }] },
      { id: "tc-kida", name: "Tacos Kida", nameAr: "طاكوس كيدة", sizes: [{ label: "XS", price: 600 }, { label: "L", price: 1100 }] },
      { id: "tc-mix", name: "Tacos Mix", nameAr: "طاكوس ميكس", sizes: [{ label: "XS", price: 700 }, { label: "L", price: 1300 }] },
    ],
  },
  {
    id: "makloub",
    name: "Makloub",
    nameAr: "ملفوف",
    icon: "scroll",
    accent: "#00BFFF",
    glow: "rgba(0,191,255,0.3)",
    items: [
      { id: "mk-poulet", name: "Makloub Poulet", nameAr: "ملفوف بولي", price: 300 },
      { id: "mk-kebda", name: "Makloub Kebda", nameAr: "ملفوف كيدة", price: 350 },
      { id: "mk-shaw", name: "Makloub Shawarma", nameAr: "ملفوف شاورما", price: 300 },
      { id: "mk-mix", name: "Makloub Mix", nameAr: "ملفوف ميكس", price: 400, popular: true },
    ],
  },
  {
    id: "plats",
    name: "Les Plats",
    nameAr: "الأطباق",
    icon: "utensils",
    accent: "#FF6B9D",
    glow: "rgba(255,107,157,0.3)",
    items: [
      { id: "pl-shaw", name: "Shawarma", nameAr: "شاورما", price: 600 },
      { id: "pl-shaw-sp", name: "Shawarma Spéciale", nameAr: "شاورما سبيشال", price: 800, popular: true },
      { id: "pl-scalope", name: "Scalope Suprême", nameAr: "سكالوب الاكرام", price: 600 },
      { id: "pl-kebab", name: "Kebab", nameAr: "كباب", price: 600 },
      { id: "pl-kebda", name: "Kebda (Foie)", nameAr: "كيدة", price: 800 },
      { id: "pl-cordon", name: "Cordon Bleu", nameAr: "كوردون بلو", price: 900, popular: true },
      { id: "pl-mashawi", name: "Mashawi", nameAr: "مشاوي", price: 1000 },
    ],
  },
  {
    id: "mexicana",
    name: "Mexicana",
    nameAr: "مكسيكا",
    icon: "zap",
    accent: "#FF7A00",
    glow: "rgba(255,122,0,0.35)",
    items: [
      { id: "mx-rich-ch", name: "Rieger Chicken", nameAr: "ريغر شيكن", price: 400 },
      { id: "mx-rich-fond", name: "Rieger Fondu", nameAr: "ريغر فوند", price: 500 },
      { id: "mx-amer", name: "Sandwich Américain", nameAr: "ساندويتش أمريكان", price: 440, popular: true },
    ],
  },
  {
    id: "makboussa",
    name: "Makboussa",
    nameAr: "مكبوسة",
    icon: "package",
    accent: "#A855F7",
    glow: "rgba(168,85,247,0.3)",
    items: [
      { id: "mb-poulet", name: "Makboussa Poulet", nameAr: "مكبوسة بولي", sizes: [{ label: "XS", price: 400 }, { label: "L", price: 600 }] },
      { id: "mb-fond", name: "Makboussa Fondu", nameAr: "مكبوسة فوند", sizes: [{ label: "XS", price: 500 }, { label: "L", price: 700 }] },
      { id: "mb-mix", name: "Makboussa Mix", nameAr: "مكبوسة ميكس", sizes: [{ label: "XS", price: 600 }, { label: "L", price: 800 }] },
    ],
  },
  {
    id: "softs",
    name: "Boissons",
    nameAr: "مشروبات",
    icon: "cup",
    accent: "#00FF88",
    glow: "rgba(0,255,136,0.3)",
    items: [
      { id: "dr-coca", name: "Coca-Cola 33cl", nameAr: "كوكا كولا", price: 100 },
      { id: "dr-fanta", name: "Fanta 33cl", nameAr: "فانتا", price: 100 },
      { id: "dr-eau", name: "Eau Minérale", nameAr: "ماء معدني", price: 50 },
      { id: "dr-jus", name: "Jus Frais", nameAr: "عصير طازج", price: 150 },
    ],
  },
];
