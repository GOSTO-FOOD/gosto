import { motion } from "framer-motion";
import { Flame, MapPin, ChefHat, Heart } from "lucide-react";
import mascotLogo from "@assets/téléchargement_(2)_1777233502629.png";

const pillars = [
  { icon: Flame,    label: "Saveurs Explosives",   desc: "Des recettes qui brûlent les papilles" },
  { icon: ChefHat,  label: "Qualité Premium",       desc: "Ingrédients sélectionnés chaque jour" },
  { icon: Heart,    label: "Fait avec Passion",     desc: "Une équipe qui aime ce qu'elle fait" },
  { icon: MapPin,   label: "Biskra, Algérie",         desc: "Né ici, fait pour vous" },
];

export default function AboutBrand() {
  return (
    <section id="about" className="py-28 relative overflow-hidden bg-[#050508]">
      {/* BG pattern */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Large glow left */}
      <div
        className="absolute top-1/2 -left-40 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,122,0,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — Mascot */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring", stiffness: 160, damping: 18 }}
              className="flex justify-center relative"
            >
              {/* Hexagon-style background frame */}
              <div className="relative">
                {/* Outer ring */}
                <div
                  className="absolute inset-0 rounded-full animate-ring-spin"
                  style={{
                    width: 360,
                    height: 360,
                    margin: "auto",
                    top: 0, left: 0, right: 0, bottom: 0,
                    border: "2px solid transparent",
                    borderTopColor: "#FF7A00",
                    borderRightColor: "rgba(255,122,0,0.2)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ring-spin-reverse"
                  style={{
                    width: 400,
                    height: 400,
                    margin: "auto",
                    top: 0, left: 0, right: 0, bottom: 0,
                    border: "1px dashed rgba(57,255,20,0.25)",
                  }}
                />

                {/* Mascot image */}
                <div
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden animate-float"
                  style={{
                    border: "3px solid rgba(255,122,0,0.4)",
                    boxShadow: "0 0 50px rgba(255,122,0,0.4), 0 0 100px rgba(255,122,0,0.2)",
                  }}
                >
                  <img
                    src={mascotLogo}
                    alt="GOSTO FOOD Mascot"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 px-4 py-2 sharp font-bebas text-2xl text-white tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, #FF7A00, #FF4500)",
                    boxShadow: "0 0 20px rgba(255,122,0,0.7)",
                  }}
                >
                  N°1
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-2 -left-6 px-3 py-2 sharp font-display font-black text-sm uppercase tracking-wider"
                  style={{
                    background: "rgba(57,255,20,0.15)",
                    border: "1px solid rgba(57,255,20,0.4)",
                    color: "#39FF14",
                    boxShadow: "0 0 15px rgba(57,255,20,0.3)",
                  }}
                >
                  Biskra
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT — Text */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, type: "spring", stiffness: 160, damping: 18 }}
              className="flex flex-col gap-7"
            >
              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 cut-sm border border-[#FF7A00]/30 bg-[#FF7A00]/8 self-start">
                <Flame size={12} style={{ color: "#FF7A00" }} />
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF7A00]/80">
                  Notre Histoire
                </span>
              </div>

              <h2
                className="font-bebas text-5xl md:text-7xl leading-none uppercase"
                style={{
                  background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                L'Explosion<br />de Saveurs
              </h2>

              <p className="text-base md:text-lg text-white/60 leading-relaxed">
                Né dans les rues animées de{" "}
                <span style={{ color: "#39FF14", fontWeight: 700 }}>Biskra</span>,{" "}
                <span style={{ color: "#FF7A00", fontWeight: 700 }}>GOSTO FOOD</span> est
                une explosion de saveurs. Nous combinons la tradition mexicaine avec des recettes
                modernes pour créer une expérience gustative unique au cœur de l'Algérie.
              </p>
              <p className="text-base md:text-lg text-white/60 leading-relaxed">
                Chaque plat est préparé avec passion, audace et des ingrédients de{" "}
                <span style={{ color: "#39FF14" }}>première qualité</span>.
              </p>

              {/* Pillars grid */}
              <div className="grid grid-cols-2 gap-4">
                {pillars.map(({ icon: Icon, label, desc }, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-4 cut-sm transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,122,0,0.3)";
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,122,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: "#FF7A00", filter: "drop-shadow(0 0 6px rgba(255,122,0,0.7))" }}
                    />
                    <span className="font-display font-black text-sm text-white uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-xs text-white/40">{desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
