import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Percent, Zap, TrendingUp, ArrowRight, Tag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const offers = [
  {
    id: "offer-pizza-family",
    title: "Pizza Family Deal",
    badge: { label: "−30%", icon: Percent },
    oldPrice: "4500 DA",
    newPrice: "3200 DA",
    priceNum: 3200,
    description: "2 Pizzas Mega + 1 Boisson 1.5L + Frites Familiales",
    accent: "#FF7A00",
    glow: "rgba(255,122,0,0.35)",
    pulse: true,
  },
  {
    id: "offer-combo-tacos",
    title: "Combo Tacos x2",
    badge: { label: "OFFRE DU JOUR", icon: Zap },
    oldPrice: "1800 DA",
    newPrice: "1400 DA",
    priceNum: 1400,
    description: "2 Tacos au choix + 2 Boissons 33cl",
    accent: "#39FF14",
    glow: "rgba(57,255,20,0.3)",
    pulse: true,
    featured: true,
  },
  {
    id: "offer-sandwich-boisson",
    title: "Sandwich + Boisson",
    badge: { label: "BEST SELLER", icon: TrendingUp },
    oldPrice: "850 DA",
    newPrice: "650 DA",
    priceNum: 650,
    description: "1 Sandwich au choix + Frites + Boisson",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.3)",
    pulse: false,
  },
];

export default function SpecialOffers() {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({ h: 11, m: 59, s: 59 });
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (offer: typeof offers[number]) => {
    addItem({
      id: offer.id,
      name: offer.title,
      category: "Offres Spéciales",
      price: offer.priceNum,
    });
    setAdded(offer.id);
    setTimeout(() => setAdded(null), 1800);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section id="offers" className="py-28 relative overflow-hidden bg-background">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Neon top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #FF7A00, #39FF14, transparent)" }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 cut-sm border border-[#FF7A00]/30 bg-[#FF7A00]/8 mb-5">
            <Tag size={12} style={{ color: "#FF7A00" }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF7A00]/80">
              Disponible maintenant
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
            Offres Spéciales
          </h2>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 mt-6 px-7 py-4 cut-sm glass border border-white/10"
          >
            <Timer size={18} style={{ color: "#FF7A00", filter: "drop-shadow(0 0 8px #FF7A00)" }} />
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-sm font-bold uppercase tracking-wider mr-2">
                Expire dans:
              </span>
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span
                    className="font-bebas text-4xl leading-none tabular-nums"
                    style={{
                      color: "#FF7A00",
                      filter: "drop-shadow(0 0 10px rgba(255,122,0,0.9))",
                    }}
                  >
                    {pad(val)}
                  </span>
                  {i < 2 && (
                    <span
                      className="font-bebas text-3xl leading-none animate-pulse mx-0.5"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      :
                    </span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {offers.map((offer, i) => {
            const BadgeIcon = offer.badge.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative sharp flex flex-col p-7 transition-all duration-400 ${
                  offer.featured ? "md:-translate-y-4" : ""
                }`}
                style={{
                  background: "rgba(8,8,12,0.9)",
                  border: `1px solid ${offer.accent}20`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${offer.accent}50`;
                  el.style.boxShadow = `0 0 30px ${offer.glow}`;
                  el.style.transform = i === 1 ? "translateY(-20px)" : "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${offer.accent}20`;
                  el.style.boxShadow = "none";
                  el.style.transform = i === 1 ? "translateY(-16px)" : "translateY(0)";
                }}
              >
                {/* Top glow band */}
                <div
                  className="absolute top-0 left-4 right-4 h-[1px] rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${offer.accent}, transparent)` }}
                />

                {/* Badge */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 cut-sm text-xs font-black uppercase tracking-widest ${
                      offer.pulse ? "animate-neon-flicker" : ""
                    }`}
                    style={{
                      background: `${offer.accent}15`,
                      border: `1px solid ${offer.accent}50`,
                      color: offer.accent,
                      filter: `drop-shadow(0 0 6px ${offer.accent})`,
                    }}
                  >
                    <BadgeIcon size={11} />
                    {offer.badge.label}
                  </div>
                </div>

                <h3
                  className="font-bebas text-3xl uppercase mb-2"
                  style={{ color: "#fff" }}
                >
                  {offer.title}
                </h3>
                <p className="text-sm text-white/40 mb-6 leading-relaxed flex-1">
                  {offer.description}
                </p>

                {/* Pricing */}
                <div className="flex items-end gap-3 mb-6">
                  <span
                    className="font-bebas text-5xl leading-none"
                    style={{ color: offer.accent, filter: `drop-shadow(0 0 10px ${offer.accent})` }}
                  >
                    {offer.newPrice}
                  </span>
                  <span className="font-bold text-lg text-white/25 line-through mb-1">
                    {offer.oldPrice}
                  </span>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => handleAdd(offer)}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-between w-full px-5 py-4 sharp font-display font-black text-sm uppercase tracking-wider transition-all duration-300"
                  style={{
                    background: added === offer.id ? `${offer.accent}35` : `${offer.accent}18`,
                    border: `1px solid ${added === offer.id ? offer.accent : `${offer.accent}40`}`,
                    color: offer.accent,
                    boxShadow: added === offer.id ? `0 0 18px ${offer.glow}` : "none",
                  }}
                >
                  {added === offer.id ? (
                    <>
                      <span>Ajouté au panier</span>
                      <Check size={18} />
                    </>
                  ) : (
                    <>
                      <span>Profiter de l'offre</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom neon line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #39FF14, #FF7A00, transparent)" }}
      />
    </section>
  );
}
