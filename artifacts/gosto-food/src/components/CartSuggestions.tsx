import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { menuData } from "@/data/menuData";

interface SuggestionItem {
  id: string;
  name: string;
  category: string;
  price: number;
  size?: string;
  emoji: string;
  reason: string;
}

function findItem(catId: string, itemId: string) {
  const cat = menuData.find((c) => c.id === catId);
  if (!cat) return null;
  const item = cat.items.find((i) => i.id === itemId);
  if (!item) return null;
  return { cat, item };
}

function buildSuggestions(cartCategories: Set<string>, cartItemIds: Set<string>): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];

  const hasMain = ["Pizza", "Tacos", "Burger", "Calzone", "Gratin", "Bateaux", "Soufflet", "Matloua", "Makloub", "Melfouf", "Chawarma", "Américain", "Mexicain", "Box"]
    .some((c) => cartCategories.has(c));

  if (!hasMain) return suggestions;

  if (!cartCategories.has("Boissons")) {
    const hamoud = findItem("boisson", "dr-hamoud");
    if (hamoud) {
      const size = hamoud.item.sizes?.[0];
      suggestions.push({
        id: hamoud.item.id,
        name: hamoud.item.name,
        category: hamoud.cat.name,
        price: size?.price ?? hamoud.item.price ?? 0,
        size: size?.label,
        emoji: "🥤",
        reason: "Une boisson fraîche ?",
      });
    }
    const coca = findItem("boisson", "dr-coca");
    if (coca) {
      suggestions.push({
        id: coca.item.id,
        name: coca.item.name,
        category: coca.cat.name,
        price: coca.item.price ?? 0,
        emoji: "🧊",
        reason: "Pour partager",
      });
    }
  }

  if (!cartCategories.has("Cheesecake")) {
    const lotus = findItem("cheesecake", "cc-lotus");
    if (lotus) {
      const size = lotus.item.sizes?.[0];
      suggestions.push({
        id: lotus.item.id,
        name: lotus.item.name,
        category: lotus.cat.name,
        price: size?.price ?? lotus.item.price ?? 0,
        size: size?.label,
        emoji: "🍰",
        reason: "Pour finir en douceur",
      });
    }
  }

  return suggestions.filter((s) => !cartItemIds.has(`${s.id}-${s.size ?? "default"}`));
}

export default function CartSuggestions() {
  const { items, addItem } = useCart();

  if (items.length === 0) return null;

  const cartCategories = new Set(items.map((i) => i.category));
  const cartItemIds = new Set(items.map((i) => i.cartId));
  const suggestions = buildSuggestions(cartCategories, cartItemIds);

  if (suggestions.length === 0) return null;

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
          {suggestions.map((s) => (
            <motion.div
              key={`${s.id}-${s.size ?? "default"}`}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative flex-shrink-0 w-[160px] flex flex-col p-3 gap-2"
              style={{
                background: "rgba(57,255,20,0.04)",
                border: "1px solid rgba(57,255,20,0.18)",
                clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl leading-none">{s.emoji}</span>
                <span className="font-bebas text-lg leading-none" style={{ color: "#39FF14" }}>
                  {s.price} DA
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-xs leading-tight truncate">{s.name}</p>
                {s.size && (
                  <span
                    className="inline-block text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 mt-1"
                    style={{
                      background: "rgba(57,255,20,0.12)",
                      color: "#39FF14",
                      clipPath: "polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
                    }}
                  >
                    {s.size}
                  </span>
                )}
                <p className="text-[9px] text-white/40 mt-1 leading-tight">{s.reason}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() =>
                  addItem({
                    id: s.id,
                    name: s.name,
                    category: s.category,
                    price: s.price,
                    size: s.size,
                  })
                }
                className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
                style={{
                  background: "rgba(57,255,20,0.12)",
                  color: "#39FF14",
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
                <Plus size={11} />
                Ajouter
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
