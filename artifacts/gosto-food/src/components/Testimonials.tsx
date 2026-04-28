import { motion } from "framer-motion";
import { Star, Quote, MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed K.",
    role: "Client Fidèle",
    text: "La meilleure pizza d'Algérie, je commande toujours ici ! Le fromage fondu est incroyable.",
    rating: 5,
    initials: "AK",
    accent: "#FF7A00",
    glow: "rgba(255,122,0,0.5)",
  },
  {
    name: "Sara M.",
    role: "Foodie Algéroise",
    text: "Les tacos sont incroyables, livraison super rapide. GOSTO FOOD c'est un niveau au-dessus !",
    rating: 5,
    initials: "SM",
    accent: "#39FF14",
    glow: "rgba(57,255,20,0.5)",
  },
  {
    name: "Youcef B.",
    role: "Amateur de Street Food",
    text: "GOSTO FOOD a changé ma vision de la street food. Le Tacos 4 fromages est hors du commun !",
    rating: 5,
    initials: "YB",
    accent: "#FFD700",
    glow: "rgba(255,215,0,0.5)",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 20 } },
};

export default function Testimonials() {
  return (
    <section className="py-28 relative overflow-hidden bg-background">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-green opacity-40 pointer-events-none" />

      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(255,122,0,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF7A00]/30 bg-[#FF7A00]/8 mb-5">
            <MessageCircle size={12} style={{ color: "#FF7A00" }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF7A00]/80">
              Ils nous font confiance
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
            Ce Qu'ils Disent
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={item}
              className="relative rounded-2xl flex flex-col p-7 transition-all duration-300"
              style={{
                background: "rgba(8,8,12,0.9)",
                border: `1px solid ${t.accent}18`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${t.accent}50`;
                el.style.boxShadow = `0 0 30px ${t.glow.replace("0.5", "0.2")}`;
                el.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${t.accent}18`;
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }}
              />

              {/* Quote icon */}
              <div className="mb-5">
                <Quote
                  size={28}
                  style={{ color: t.accent, filter: `drop-shadow(0 0 8px ${t.accent})`, opacity: 0.7 }}
                />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, si) => (
                  <Star
                    key={si}
                    size={15}
                    fill={t.accent}
                    style={{
                      color: t.accent,
                      filter: `drop-shadow(0 0 4px ${t.accent})`,
                    }}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-white/60 text-base leading-relaxed italic flex-1 mb-7">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/6">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0"
                  style={{
                    background: `${t.accent}25`,
                    border: `2px solid ${t.accent}60`,
                    boxShadow: `0 0 12px ${t.glow}`,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-display font-black text-sm text-white">{t.name}</div>
                  <div className="text-xs text-white/35 font-bold uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
