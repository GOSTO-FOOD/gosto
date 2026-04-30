import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed, Flame, Layers, ScrollText, Zap, Package,
  CupSoda, Ship, Plus, Star, ChefHat, Beef, Cake, Pizza,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { menuData, type MenuItem, type MenuCategory } from "@/data/menuData";

const iconMap: Record<string, React.ElementType> = {
  pizza: Pizza,
  layers: Layers,
  ship: Ship,
  flame: Flame,
  scroll: ScrollText,
  utensils: ChefHat,
  zap: Zap,
  package: Package,
  cup: CupSoda,
  burger: Beef,
  cake: Cake,
};

function ItemCard({ item, category }: { item: MenuItem; category: MenuCategory }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (size?: string, price?: number) => {
    const finalPrice = price ?? item.price ?? 0;
    const key = size ?? "default";
    addItem({
      id: item.id,
      name: item.name,
      category: category.name,
      price: finalPrice,
      size,
    });
    setAdded(key);
    setTimeout(() => setAdded(null), 900);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="sharp p-4 flex flex-col gap-3 relative overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${category.accent}08, rgba(0,0,0,0))`,
        border: `1px solid ${category.accent}18`,
      }}
    >
      {/* Popular badge */}
      {item.popular && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 cut-sm"
          style={{ background: `${category.accent}20`, border: `1px solid ${category.accent}40` }}
        >
          <Star size={8} style={{ color: category.accent }} />
          <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: category.accent }}>
            Populaire
          </span>
        </div>
      )}

      {/* Names */}
      <div>
        <p className="font-bold text-white text-sm leading-tight pr-16">{item.name}</p>
        {item.nameAr && (
          <p className="text-sm text-white/75 font-bold mt-0.5" dir="rtl" style={{ fontFamily: "Poppins, sans-serif", letterSpacing: "0.01em" }}>{item.nameAr}</p>
        )}
      </div>

      {/* Sizes or single price */}
      {item.sizes ? (
        <div className="flex flex-col gap-2">
          {item.sizes.map((sz) => {
            const key = sz.label;
            const isAdded = added === key;
            return (
              <div key={sz.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 cut-sm"
                    style={{ background: `${category.accent}15`, color: category.accent }}
                  >
                    {sz.label}
                  </span>
                  <span className="font-bebas text-base leading-none text-white/80">
                    {sz.price.toLocaleString()} DA
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleAdd(sz.label, sz.price)}
                  className="w-7 h-7 sharp flex items-center justify-center transition-all"
                  style={{
                    background: isAdded ? category.accent : `${category.accent}20`,
                    border: `1px solid ${category.accent}40`,
                    boxShadow: isAdded ? `0 0 12px ${category.glow}` : "none",
                  }}
                >
                  <Plus size={13} style={{ color: isAdded ? "#000" : category.accent }} />
                </motion.button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bebas text-xl leading-none" style={{ color: category.accent, filter: `drop-shadow(0 0 6px ${category.accent})` }}>
            {item.price?.toLocaleString()} DA
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleAdd(undefined, item.price)}
            className="w-8 h-8 sharp flex items-center justify-center transition-all"
            style={{
              background: added === "default" ? category.accent : `${category.accent}20`,
              border: `1px solid ${category.accent}40`,
              boxShadow: added === "default" ? `0 0 14px ${category.glow}` : "none",
            }}
          >
            <Plus size={15} style={{ color: added === "default" ? "#000" : category.accent }} />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default function MenuShowcase() {
  const [activeId, setActiveId] = useState(menuData[0].id);
  const activeCategory = menuData.find((c) => c.id === activeId) ?? menuData[0];
  const Icon = iconMap[activeCategory.icon] ?? UtensilsCrossed;

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (typeof id === "string" && menuData.some((c) => c.id === id)) {
        setActiveId(id);
      }
    };
    window.addEventListener("gosto:open-category", handler);
    return () => window.removeEventListener("gosto:open-category", handler);
  }, []);

  return (
    <section id="menu" className="py-24 relative bg-background overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 bg-grid-green opacity-40 pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.5), transparent)",
          boxShadow: "0 0 80px 20px rgba(255,122,0,0.06)",
        }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 cut-sm border border-[#FF7A00]/30 bg-[#FF7A00]/8 mb-5">
            <UtensilsCrossed size={12} style={{ color: "#FF7A00" }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF7A00]/80">
              Notre Menu Complet
            </span>
          </div>
          <h2
            className="font-bebas text-6xl md:text-8xl leading-none uppercase"
            style={{
              background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.4))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MENU
          </h2>
        </motion.div>

        {/* Category tabs — scrollable */}
        <div className="relative mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {menuData.map((cat) => {
              const CatIcon = iconMap[cat.icon] ?? UtensilsCrossed;
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveId(cat.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 sharp font-bold text-xs uppercase tracking-wider transition-all snap-start"
                  style={{
                    background: isActive ? cat.accent : "rgba(255,255,255,0.04)",
                    border: isActive ? `1px solid ${cat.accent}` : "1px solid rgba(255,255,255,0.08)",
                    color: isActive ? "#000" : "rgba(255,255,255,0.5)",
                    boxShadow: isActive ? `0 0 20px ${cat.glow}` : "none",
                  }}
                >
                  <CatIcon size={14} />
                  <span>{cat.name}</span>
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 cut-sm"
                    style={{
                      background: isActive ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.08)",
                      color: isActive ? "#000" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {cat.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active category display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {/* Category header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-12 h-12 sharp flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${activeCategory.accent}18`,
                  border: `1px solid ${activeCategory.accent}35`,
                  boxShadow: `0 0 20px ${activeCategory.glow}`,
                }}
              >
                <Icon size={22} style={{ color: activeCategory.accent }} />
              </div>
              <div>
                <h3
                  className="font-bebas text-3xl leading-none uppercase tracking-wider"
                  style={{ color: activeCategory.accent, filter: `drop-shadow(0 0 8px ${activeCategory.accent})` }}
                >
                  {activeCategory.name}
                </h3>
                <p className="text-base text-white/70 font-bold mt-0.5" dir="rtl">
                  {activeCategory.nameAr}
                </p>
              </div>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {activeCategory.items.map((item) => (
                <ItemCard key={item.id} item={item} category={activeCategory} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
