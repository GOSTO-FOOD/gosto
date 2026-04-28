import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronDown, Zap, Award, Clock } from "lucide-react";
import mascotLogo from "@assets/téléchargement_(2)_1777233502629.png";

const stats = [
  { icon: Award, value: "N°1", label: "Street Food Biskra" },
  { icon: Zap,   value: "+5K", label: "Commandes / Mois" },
  { icon: Clock, value: "20min", label: "Livraison Express" },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      color: string;
      alpha: number;
      dalpha: number;
    };

    const colors = ["#FF7A00", "#FF4500", "#39FF14", "#FFD700"];
    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -(Math.random() * 0.5 + 0.15),
      radius: Math.random() * 2.4 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      dalpha: (Math.random() - 0.5) * 0.01,
    }));

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0.05, Math.min(0.85, p.alpha + p.dalpha));
        if (p.alpha <= 0.05 || p.alpha >= 0.85) p.dalpha *= -1;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Animated canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid animate-grid-move opacity-60 pointer-events-none z-[1]" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(7,7,10,0.85) 100%)",
        }}
      />

      {/* Bottom orange glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-[2]"
        style={{
          width: 700,
          height: 200,
          background: "radial-gradient(ellipse, rgba(255,122,0,0.18) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center gap-8 mt-6 mb-28">

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-5 py-2 cut-sm glass border border-white/10"
        >
          <Zap size={14} style={{ color: "#39FF14", filter: "drop-shadow(0 0 5px #39FF14)" }} />
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/70">
            Street Food Premium — Biskra
          </span>
          <Zap size={14} style={{ color: "#39FF14", filter: "drop-shadow(0 0 5px #39FF14)" }} />
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, type: "spring", stiffness: 180, damping: 18 }}
          className="relative"
        >
          {/* Glow rings */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-orange"
            style={{
              transform: "scale(1.35)",
              background:
                "radial-gradient(circle, rgba(255,122,0,0.2) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-[#FF7A00]/30 animate-ring-spin"
            style={{ transform: "scale(1.55)" }}
          />
          <div
            className="absolute inset-0 rounded-full border border-[#39FF14]/20 animate-ring-spin-reverse"
            style={{ transform: "scale(1.75)" }}
          />

          <img
            src={mascotLogo}
            alt="GOSTO FOOD Mascot"
            className="w-52 md:w-72 lg:w-[320px] h-auto relative z-10 animate-float rounded-full"
            style={{
              boxShadow:
                "0 0 50px rgba(255,122,0,0.5), 0 0 100px rgba(255,122,0,0.25)",
              objectFit: "cover",
            }}
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <h1
            className="font-bebas leading-none uppercase text-center"
            style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)", lineHeight: 0.92 }}
          >
            <span className="text-white">TASTE THE </span>
            <span
              style={{
                background: "linear-gradient(135deg, #FF7A00, #FF4500, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 18px rgba(255,122,0,0.7))",
              }}
            >
              MADNESS
            </span>
          </h1>

          <p
            className="font-bebas text-2xl md:text-4xl tracking-[0.25em] uppercase"
            style={{
              color: "#39FF14",
              filter: "drop-shadow(0 0 8px rgba(57,255,20,0.8))",
            }}
          >
            Fast. Bold. Unforgettable.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            className="group relative flex items-center gap-3 px-10 py-5 sharp font-display font-black text-white text-lg uppercase tracking-widest overflow-hidden transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #FF7A00, #FF4500)",
              boxShadow:
                "0 0 30px rgba(255,122,0,0.6), 0 0 60px rgba(255,122,0,0.3)",
            }}
          >
            <span className="absolute inset-0 animate-shimmer opacity-50" />
            <ShoppingBag size={22} className="relative z-10" />
            <span className="relative z-10">Commander Maintenant</span>
          </button>

          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 px-8 py-5 sharp font-display font-bold text-white/70 text-sm uppercase tracking-widest border border-white/15 hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all"
          >
            Notre Histoire
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 mt-2"
        >
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3 cut-sm glass border border-white/8"
            >
              <Icon
                size={18}
                style={{ color: "#FF7A00", filter: "drop-shadow(0 0 6px rgba(255,122,0,0.8))" }}
              />
              <div className="text-left">
                <div
                  className="font-bebas text-2xl leading-none"
                  style={{ color: "#FF7A00" }}
                >
                  {value}
                </div>
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Marquee ticker */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10 border-y border-[#FF7A00]/20 bg-[#FF7A00]/8 backdrop-blur-sm py-3">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-0">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="font-bebas text-2xl tracking-[0.15em] uppercase px-6 text-white/60 flex-shrink-0"
            >
              PIZZA &nbsp;•&nbsp; TACOS &nbsp;•&nbsp; BURGERS &nbsp;•&nbsp; SANDWICHS &nbsp;•&nbsp; SALADES &nbsp;•&nbsp; BOISSONS &nbsp;•&nbsp; LIVRAISON RAPIDE &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={24} className="text-white/30" />
      </motion.div>
    </section>
  );
}
