import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { menuData } from "@/data/menuData";

interface SuggestionVariant {
  label?: string;
  price: number;
}

interface SuggestionCard {
  id: string;
  name: string;
  category: string;
  emoji: string;
  reason: string;
  variants: SuggestionVariant[];
}

function findItem(catId: string, itemId: string) {
  const cat = menuData.find((c) => c.id === catId);
  if (!cat) return null;
  const item = cat.items.find((i) => i.id === itemId);
  if (!item) return null;
  return { cat, item };
}

function buildCard(catId: string, itemId: string, emoji: string, reason: string): SuggestionCard | null {
  const found = findItem(catId, itemId);
  if (!found) return null;
  const { cat, item } = found;
  const variants: SuggestionVariant[] = item.sizes
    ? item.sizes.map((s) => ({ label: s.label, price: s.price }))
    : [{ price: item.price ?? 0 }];
  return {
    id: item.id,
    name: item.name,
    category: cat.name,
    emoji,
    reason,
    variants,
  };
}

function buildSuggestions(cartCategories: Set<string>): SuggestionCard[] {
  const cards: SuggestionCard[] = [];

  const hasMain = ["Pizza", "Tacos", "Burger", "Calzone", "Gratin", "Bateaux", "Soufflet", "Matloua", "Makloub", "Melfouf", "Chawarma", "Américain", "Mexicain", "Box"]
    .some((c) => cartCategories.has(c));

  if (!hasMain) return cards;

  if (!cartCategories.has("Boissons")) {
    const drinks = [
      buildCard("boisson", "dr-farha", "🥤", "Boisson locale"),
      buildCard("boisson", "dr-hamoud", "🍋", "Le classique"),
      buildCard("boisson", "dr-jus", "🧃", "Jus frais"),
      buildCard("boisson", "dr-coca", "🧊", "Pour partager"),
    ].filter((c): c is SuggestionCard => c !== null);
    cards.push(...drinks);
  }

  if (!cartCategories.has("Cheesecake")) {
    const dessert = buildCard("cheesecake", "cc-lotus", "🍰", "Pour finir en douceur");
    if (dessert) cards.push(dessert);
  }

  return cards;
}

export default function CartSuggestions() {
  const { items, addItem } = useCart();

  if (items.length === 0) return null;

  const cartCategories = new Set(items.map((i) => i.category));
  const cards = buildSuggestions(cartCategories);

  if (cards.length === 0) return null;

  return (
    <div
      className="relative flex-shrink-0 px-5 py-4"
      style={{ zIndex: 3, borderTop: "1px solid rgba(57,255,20,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} style={{ color: "#39FF14", filter: "drop-shadow(0 0 6px #39FF14)" }} />
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#39FF14]/90">
          Compléter votre commande
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative flex-shrink-0 w-[170px] flex flex-col p-3 gap-2"
              style={{
                background: "rgba(57,255,20,0.04)",
                border: "1px solid rgba(57,255,20,0.18)",
                clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl leading-none">{card.emoji}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-xs leading-tight truncate">{card.name}</p>
                <p className="text-[9px] text-white/40 mt-0.5 leading-tight">{card.reason}</p>
              </div>

              <div className={`grid gap-1 ${card.variants.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {card.variants.map((v) => (
                  <motion.button
                    key={v.label ?? "default"}
                    whileTap={{ scale: 0.94 }}
                    onClick={() =>
                      addItem({
                        id: card.id,
                        name: card.name,
                        category: card.category,
                        price: v.price,
                        size: v.label,
                      })
                    }
                    className="flex flex-col items-center justify-center py-1.5 transition-all"
                    style={{
                      background: "rgba(57,255,20,0.12)",
                      border: "1px solid rgba(57,255,20,0.4)",
                      clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(57,255,20,0.22)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(57,255,20,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(57,255,20,0.12)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    }}
                  >
                    {v.label && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#39FF14]/70 leading-none">
                        {v.label}
                      </span>
                    )}
                    <span className="font-bebas text-base leading-none mt-0.5 flex items-baseline gap-0.5" style={{ color: "#39FF14" }}>
                      <Plus size={9} className="opacity-70" />
                      {v.price}
                      <span className="text-[7px] tracking-wider ml-0.5">DA</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
