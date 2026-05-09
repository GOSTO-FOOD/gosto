import { motion } from "framer-motion";
import { CupSoda, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const MAIN_CATEGORIES = new Set([
  "Pizza", "Tacos", "Burger", "Calzone", "Gratin", "Bateaux", "Soufflet",
  "Matloua", "Makloub", "Melfouf", "Chawarma", "Américain", "Mexicain", "Box",
]);

export default function CartSuggestions() {
  const { items, closeCart } = useCart();

  if (items.length === 0) return null;

  const cartCategories = new Set(items.map((i) => i.category));
  const hasMain = [...cartCategories].some((c) => MAIN_CATEGORIES.has(c));
  const hasDrink = cartCategories.has("Boissons");

  if (!hasMain || hasDrink) return null;

  const handleClick = () => {
    closeCart();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("gosto:open-category", { detail: "boisson" }));
      const el = document.getElementById("menu");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  };

  return (
    <div
      className="relative flex-shrink-0 px-5 py-4"
      style={{ zIndex: 3, borderTop: "1px solid rgba(57,255,20,0.15)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center gap-3 p-3"
        style={{
          background: "rgba(57,255,20,0.05)",
          border: "1px solid rgba(57,255,20,0.25)",
          clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
        }}
      >
        <div
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
          style={{
            background: "rgba(57,255,20,0.12)",
            border: "1px solid rgba(57,255,20,0.4)",
            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
          }}
        >
          <CupSoda size={18} style={{ color: "#39FF14", filter: "drop-shadow(0 0 6px #39FF14)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm leading-tight" dir="rtl">
            مخصكش مشروب ؟
          </p>
          <p className="text-[10px] text-white/40 leading-tight mt-0.5">
            Pas de boisson dans votre commande
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleClick}
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all flex-shrink-0"
          style={{
            background: "rgba(57,255,20,0.15)",
            color: "#39FF14",
            border: "1px solid rgba(57,255,20,0.5)",
            clipPath: "polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(57,255,20,0.28)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 14px rgba(57,255,20,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(57,255,20,0.15)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          Ajouter
          <ArrowRight size={11} />
        </motion.button>
      </motion.div>
    </div>
  );
}
