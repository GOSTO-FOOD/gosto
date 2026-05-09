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
      { id: "pz-marg", name: "Marguerite", nameAr: "مارغريتا", sizes: [{ label: "L", price: 250 }, { label: "XL", price: 500 }, { label: "XXL", price: 700 }] },
      { id: "pz-2f", name: "2 Fromages", nameAr: "فرماجين", sizes: [{ label: "L", price: 350 }, { label: "XL", price: 700 }, { label: "XXL", price: 1000 }] },
      { id: "pz-veg", name: "Végétarienne", nameAr: "خضرية", sizes: [{ label: "L", price: 400 }, { label: "XL", price: 800 }, { label: "XXL", price: 1100 }] },
      { id: "pz-champ", name: "Champignon", nameAr: "فطر", sizes: [{ label: "L", price: 450 }, { label: "XL", price: 900 }, { label: "XXL", price: 1200 }] },
      { id: "pz-viande", name: "Viande", nameAr: "لحم", sizes: [{ label: "L", price: 500 }, { label: "XL", price: 1000 }, { label: "XXL", price: 1400 }] },
      { id: "pz-thon", name: "Thon", nameAr: "تن", sizes: [{ label: "L", price: 500 }, { label: "XL", price: 1000 }, { label: "XXL", price: 1400 }] },
      { id: "pz-pana", name: "Panachée", nameAr: "مشكلة", sizes: [{ label: "L", price: 500 }, { label: "XL", price: 1000 }, { label: "XXL", price: 1400 }] },
      { id: "pz-poul", name: "Poulet", nameAr: "دجاج", sizes: [{ label: "L", price: 500 }, { label: "XL", price: 1000 }, { label: "XXL", price: 1400 }] },
      { id: "pz-3f", name: "3 Fromages", nameAr: "3 فرماج", sizes: [{ label: "L", price: 600 }, { label: "XL", price: 1200 }, { label: "XXL", price: 1700 }], popular: true },
      { id: "pz-poul-bois", name: "Poulet Boisé", nameAr: "دجاج بواسي", sizes: [{ label: "L", price: 600 }, { label: "XL", price: 1100 }, { label: "XXL", price: 1600 }] },
      { id: "pz-3s", name: "3 Saisons", nameAr: "3 فصول", sizes: [{ label: "L", price: 600 }, { label: "XL", price: 1200 }, { label: "XXL", price: 1600 }] },
      { id: "pz-4s", name: "4 Saisons", nameAr: "الفصول الأربعة", sizes: [{ label: "L", price: 750 }, { label: "XL", price: 1500 }, { label: "XXL", price: 2000 }] },
      { id: "pz-surp", name: "Surprise", nameAr: "سربرايز", sizes: [{ label: "L", price: 750 }, { label: "XL", price: 1500 }, { label: "XXL", price: 2000 }] },
      { id: "pz-4f", name: "4 Fromages", nameAr: "4 فرماج", sizes: [{ label: "L", price: 800 }, { label: "XL", price: 1600 }, { label: "XXL", price: 2200 }], popular: true },
      { id: "pz-5f", name: "5 Fromages", nameAr: "5 فرماج", sizes: [{ label: "L", price: 900 }, { label: "XL", price: 1800 }, { label: "XXL", price: 2500 }] },
      { id: "pz-gosto", name: "Pizza GOSTO", nameAr: "بيتزا قوستو", sizes: [{ label: "L", price: 950 }, { label: "XL", price: 1900 }, { label: "XXL", price: 2400 }], popular: true },
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
      { id: "tc-normal", name: "Tacos Normal", nameAr: "طاكوس عادي", sizes: [{ label: "P", price: 400 }, { label: "G", price: 800 }] },
      { id: "tc-grat", name: "Tacos Gratiné", nameAr: "طاكوس غراتيني", sizes: [{ label: "P", price: 500 }, { label: "G", price: 1000 }] },
      { id: "tc-cam", name: "Tacos Camembert", nameAr: "طاكوس كاممبير", sizes: [{ label: "P", price: 550 }, { label: "G", price: 1100 }] },
      { id: "tc-3f", name: "Tacos 3 Fromages", nameAr: "طاكوس 3 فرماج", sizes: [{ label: "P", price: 550 }, { label: "G", price: 1100 }], popular: true },
      { id: "tc-grat-p", name: "Tacos Gratiné +", nameAr: "طاكوس غراتيني بلوس", sizes: [{ label: "P", price: 550 }, { label: "G", price: 1100 }] },
      { id: "tc-gris", name: "Tacos Grisèle", nameAr: "طاكوس غريزل", sizes: [{ label: "P", price: 550 }, { label: "G", price: 1100 }] },
      { id: "tc-roy", name: "Tacos Royale", nameAr: "طاكوس رويال", sizes: [{ label: "P", price: 600 }, { label: "G", price: 1100 }] },
      { id: "tc-3f-p", name: "Tacos 3 Fromages +", nameAr: "طاكوس 3 فرماج بلوس", sizes: [{ label: "P", price: 600 }, { label: "G", price: 1200 }] },
      { id: "tc-king", name: "Tacos King", nameAr: "طاكوس كينغ", sizes: [{ label: "P", price: 700 }, { label: "G", price: 1300 }], popular: true },
      { id: "tc-tram", name: "Tacos Tramway", nameAr: "طاكوس ترامواي", price: 1600, popular: true, note: "XXL — partage" },
    ],
  },
  {
    id: "burger",
    name: "Burger",
    nameAr: "برغر",
    icon: "burger",
    accent: "#FF4500",
    glow: "rgba(255,69,0,0.35)",
    items: [
      { id: "bg-chick", name: "Burger Chicken", nameAr: "برغر دجاج", price: 250 },
      { id: "bg-viande", name: "Burger Viande", nameAr: "برغر لحم", price: 300 },
      { id: "bg-double", name: "Burger Double", nameAr: "برغر دوبل", price: 500, popular: true },
    ],
  },
  {
    id: "calzone",
    name: "Calzone",
    nameAr: "كالزون",
    icon: "layers",
    accent: "#FF7A00",
    glow: "rgba(255,122,0,0.3)",
    items: [
      { id: "cz-poulet", name: "Calzone Poulet", nameAr: "كالزون دجاج", price: 700 },
      { id: "cz-mix", name: "Calzone Mix", nameAr: "كالزون ميكس", price: 800 },
      { id: "cz-viande", name: "Calzone Viande", nameAr: "كالزون لحم", price: 800 },
      { id: "cz-4f", name: "Calzone 4 Fromages", nameAr: "كالزون 4 فرماج", price: 850, popular: true },
    ],
  },
  {
    id: "gratin",
    name: "Gratin",
    nameAr: "غراتان",
    icon: "layers",
    accent: "#FF6B9D",
    glow: "rgba(255,107,157,0.3)",
    items: [
      { id: "gr-poulet", name: "Gratin Poulet", nameAr: "غراتان دجاج", sizes: [{ label: "M", price: 350 }, { label: "L", price: 450 }, { label: "XL", price: 600 }] },
      { id: "gr-mix", name: "Gratin Mix", nameAr: "غراتان ميكس", sizes: [{ label: "M", price: 450 }, { label: "L", price: 550 }, { label: "XL", price: 700 }], popular: true },
      { id: "gr-viande", name: "Gratin Viande", nameAr: "غراتان لحم", sizes: [{ label: "M", price: 450 }, { label: "L", price: 550 }, { label: "XL", price: 700 }] },
    ],
  },
  {
    id: "bateaux",
    name: "Bateaux",
    nameAr: "باطو",
    icon: "ship",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.3)",
    items: [
      { id: "bt-poulet", name: "Bateau Poulet", nameAr: "باطو دجاج", price: 500 },
      { id: "bt-mix", name: "Bateau Mix", nameAr: "باطو ميكس", price: 600, popular: true },
      { id: "bt-viande", name: "Bateau Viande", nameAr: "باطو لحم", price: 600 },
    ],
  },
  {
    id: "souflet",
    name: "Soufflet",
    nameAr: "سوفلي",
    icon: "layers",
    accent: "#FFA500",
    glow: "rgba(255,165,0,0.3)",
    items: [
      { id: "sf-poulet", name: "Soufflet Poulet", nameAr: "سوفلي دجاج", price: 500 },
      { id: "sf-kebda", name: "Soufflet Kebda", nameAr: "سوفلي كبدة", price: 600 },
      { id: "sf-viande", name: "Soufflet Viande", nameAr: "سوفلي لحم", price: 600 },
    ],
  },
  {
    id: "matloua",
    name: "Matloua",
    nameAr: "مطلوع",
    icon: "scroll",
    accent: "#D4A574",
    glow: "rgba(212,165,116,0.3)",
    items: [
      { id: "mt-poulet", name: "Matloua Poulet", nameAr: "مطلوع دجاج", price: 300 },
      { id: "mt-kebda", name: "Matloua Kebda", nameAr: "مطلوع كبدة", price: 400 },
    ],
  },
  {
    id: "makloub",
    name: "Makloub",
    nameAr: "مقلوب",
    icon: "scroll",
    accent: "#00BFFF",
    glow: "rgba(0,191,255,0.3)",
    items: [
      { id: "mk-poulet", name: "Makloub Poulet", nameAr: "مقلوب دجاج", price: 400 },
      { id: "mk-thon", name: "Makloub Thon", nameAr: "مقلوب تن", price: 500 },
      { id: "mk-viande", name: "Makloub Viande", nameAr: "مقلوب لحم", price: 500 },
      { id: "mk-kebda", name: "Makloub Kebda", nameAr: "مقلوب كبدة", price: 500 },
      { id: "mk-mix", name: "Makloub Mix", nameAr: "مقلوب ميكس", price: 500, popular: true },
    ],
  },
  {
    id: "melfouf",
    name: "Melfouf",
    nameAr: "ملفوف",
    icon: "scroll",
    accent: "#A855F7",
    glow: "rgba(168,85,247,0.3)",
    items: [
      { id: "ml-shaw", name: "Melfouf Chawarma", nameAr: "ملفوف شاورما", price: 300 },
      { id: "ml-poulet", name: "Melfouf Poulet", nameAr: "ملفوف دجاج", price: 300 },
      { id: "ml-kebda", name: "Melfouf Kebda", nameAr: "ملفوف كبدة", price: 400 },
    ],
  },
  {
    id: "chawarma",
    name: "Chawarma",
    nameAr: "شاورما",
    icon: "scroll",
    accent: "#FF6347",
    glow: "rgba(255,99,71,0.3)",
    items: [
      { id: "ch-arabi", name: "Chawarma Arabi", nameAr: "شاورما عربي", price: 500 },
    ],
  },
  {
    id: "americain",
    name: "Américain",
    nameAr: "أمريكان",
    icon: "utensils",
    accent: "#E63946",
    glow: "rgba(230,57,70,0.3)",
    items: [
      { id: "am-normal", name: "Américain Normal", nameAr: "أمريكان عادي", price: 600 },
    ],
  },
  {
    id: "mexicain",
    name: "Mexicain",
    nameAr: "مكسيكي",
    icon: "zap",
    accent: "#FF8C00",
    glow: "rgba(255,140,0,0.3)",
    items: [
      { id: "mx-mex", name: "Mexicain", nameAr: "مكسيكي", price: 500 },
    ],
  },
  {
    id: "box",
    name: "Box",
    nameAr: "بوكس",
    icon: "package",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.3)",
    items: [
      { id: "bx-50", name: "Box 50", nameAr: "بوكس 50", price: 500 },
      { id: "bx-100", name: "Box 100", nameAr: "بوكس 100", price: 1000, popular: true },
    ],
  },
  {
    id: "cheesecake",
    name: "Cheesecake",
    nameAr: "تشيز كيك",
    icon: "cake",
    accent: "#FF6B9D",
    glow: "rgba(255,107,157,0.35)",
    items: [
      { id: "cc-choco", name: "Cheesecake Chocolat", nameAr: "تشيز كيك شوكولا", sizes: [{ label: "Petit", price: 250 }, { label: "Grand", price: 450 }] },
      { id: "cc-snick", name: "Cheesecake Snickers", nameAr: "تشيز كيك سنيكرز", sizes: [{ label: "Petit", price: 250 }, { label: "Grand", price: 450 }], popular: true },
      { id: "cc-lotus", name: "Cheesecake Lotus", nameAr: "تشيز كيك لوتس", sizes: [{ label: "Petit", price: 250 }, { label: "Grand", price: 450 }], popular: true },
      { id: "cc-fram", name: "Cheesecake Framboise", nameAr: "تشيز كيك فرامبواز", sizes: [{ label: "Petit", price: 250 }, { label: "Grand", price: 450 }] },
      { id: "cc-pist", name: "Cheesecake Pistache", nameAr: "تشيز كيك فستق", price: 300 },
    ],
  },
  {
    id: "boisson",
    name: "Boissons",
    nameAr: "مشروبات",
    icon: "cup",
    accent: "#00FF88",
    glow: "rgba(0,255,136,0.3)",
    items: [
      { id: "dr-farha", name: "Farha", nameAr: "فرحة", sizes: [{ label: "33cl", price: 50 }, { label: "1L", price: 100 }] },
      { id: "dr-hamoud", name: "Hamoud", nameAr: "حمود", sizes: [{ label: "33cl", price: 60 }, { label: "1L", price: 120 }] },
      { id: "dr-jus", name: "Jus", nameAr: "عصير", sizes: [{ label: "33cl", price: 70 }] },
      { id: "dr-coca", name: "Coca-Cola", nameAr: "كوكا كولا", price: 150 },
    ],
  },
];
