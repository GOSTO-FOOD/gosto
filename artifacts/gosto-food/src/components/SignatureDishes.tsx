import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Award, Sparkles, TrendingUp, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const dishes = [
  {
    id: "sig-super-pizza",
    name: "La Super Pizza",
    subtitle: "XXL Signature",
    price: "2500 DA",
    priceNum: 2500,
    description:
      "XXL géante garnie généreusement avec double fromage fondu, viande hachée spéciale et sauce secrète Gosto.",
    badge: { label: "Populaire", icon: TrendingUp },
    gradient: "from-[#FF7A00] via-[#FF4500] to-[#8B0000]",
    accent: "#FF7A00",
    glow: "rgba(255,122,0,0.4)",
    pattern: "bg-[radial-gradient(circle_at_30%_70%,rgba(255,122,0,0.3),transparent_60%)]",
  },
  {
    id: "sig-tacos-4-fromages",
    name: "Tacos 4 Fromages",
    subtitle: "Recette Exclusive",
    price: "1800 DA",
    priceNum: 1800,
    description:
      "Croustillant, fondant, inoubliable. Mélange parfait de 4 fromages, viande marinée et sauce fusion.",
    badge: { label: "Nouveau", icon: Sparkles },
    gradient: "from-[#39FF14] via-[#00CC44] to-[#004D1A]",
    accent: "#39FF14",
    glow: "rgba(57,255,20,0.35)",
    pattern: "bg-[radial-gradient(circle_at_70%_30%,rgba(57,255,20,0.25),transparent_60%)]",
  },
  {
    id: "sig-americain-special",
    name: "Américain Spécial",
    subtitle: "Classique Légendaire",
    price: "450 DA",
    priceNum: 450,
    description:
      "Sandwich légendaire à l'américaine avec sauce secrète Gosto, frites croustillantes et coleslaw maison.",
    badge: { label: "Classique", icon: Award },
    gradient: "from-[#FFD700] via-[#FFA500] to-[#8B4500]",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.35)",
    pattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.2),transparent_60%)]",
  },
];

export default function SignatureDishes() {
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (dish: typeof dishes[number]) => {
    addItem({
      id: dish.id,
      name: dish.name,
      category: "Spécialités",
      price: dish.priceNum,
    });
    setAdded(dish.id);
    setTimeout(() => setAdded(null), 1800);
  };

  return (
    <section id="specialites" className="py-28 relative overflow-hidden bg-[#050508]">
      {/* Top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.4), transparent)",
        }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 cut-sm border border-[#39FF14]/30 bg-[#39FF14]/8 mb-5">
            <Award size={12} style={{ color: "#39FF14" }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#39FF14" }}>
              Sélection du chef
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
            Nos Spécialités
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {dishes.map((dish, i) => {
            const BadgeIcon = dish.badge.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.15, duration: 0.5, type: "spring", stiffness: 240, damping: 20 }}
                className="group relative sharp overflow-hidden flex flex-col cursor-pointer"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${dish.accent}50`;
                  el.style.boxShadow = `0 0 40px ${dish.glow}, 0 20px 60px rgba(0,0,0,0.5)`;
                  el.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Cinematic header */}
                <div
                  className="relative h-52 overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.8)" }}
                >
                  {/* Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${dish.gradient} opacity-80`}
                  />
                  {/* Pattern overlay */}
                  <div className={`absolute inset-0 ${dish.pattern}`} />

                  {/* Grid */}
                  <div
                    className="absolute inset-0 bg-grid opacity-30"
                    style={{ backgroundSize: "30px 30px" }}
                  />

                  {/* Bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />

                  {/* Price badge */}
                  <div className="absolute bottom-4 left-5">
                    <div
                      className="px-4 py-2 cut-sm"
                      style={{
                        background: "rgba(0,0,0,0.7)",
                        border: `1px solid ${dish.accent}50`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <span
                        className="font-bebas text-3xl leading-none"
                        style={{ color: dish.accent, filter: `drop-shadow(0 0 8px ${dish.accent})` }}
                      >
                        {dish.price}
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 cut-sm text-xs font-black uppercase tracking-wider"
                      style={{
                        background: `${dish.accent}22`,
                        border: `1px solid ${dish.accent}60`,
                        color: dish.accent,
                      }}
                    >
                      <BadgeIcon size={11} />
                      {dish.badge.label}
                    </div>
                  </div>

                  {/* Dish name overlapping */}
                  <div className="absolute bottom-14 left-5">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
                      {dish.subtitle}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div
                  className="flex-1 flex flex-col p-6 gap-5"
                  style={{ background: "rgba(8,8,12,0.95)" }}
                >
                  <h3
                    className="font-bebas text-3xl leading-none uppercase"
                    style={{ color: "#fff" }}
                  >
                    {dish.name}
                  </h3>

                  <p className="text-sm text-white/50 leading-relaxed flex-1">
                    {dish.description}
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAdd(dish)}
                    className="group/btn flex items-center justify-between w-full px-5 py-3.5 sharp font-display font-black text-sm uppercase tracking-wider transition-all duration-300"
                    style={{
                      border: `1px solid ${added === dish.id ? dish.accent : `${dish.accent}30`}`,
                      color: dish.accent,
                      background: added === dish.id ? `${dish.accent}22` : `${dish.accent}10`,
                      boxShadow: added === dish.id ? `0 0 16px ${dish.glow}` : "none",
                    }}
                  >
                    {added === dish.id ? (
                      <>
                        <span>Ajouté</span>
                        <Check size={18} />
                      </>
                    ) : (
                      <>
                        <span>Commander</span>
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
