import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mascotLogo from "@assets/téléchargement_(2)_1777233502629.png";
import { Flame } from "lucide-react";

interface LoaderProps {
  onComplete: () => void;
}

const LOAD_DURATION = 3800;

const cookingSteps = [
  "SÉLECTION DES INGRÉDIENTS...",
  "PRÉPARATION EN COURS...",
  "ASSAISONNEMENT PARFAIT...",
  "CUISSON ULTRA RAPIDE...",
  "GOSTO FOOD EST PRÊT !",
];

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "logo" | "progress" | "done">("intro");
  const [curtain, setCurtain] = useState(false);
  const [hidden, setHidden] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 600);
    const t2 = setTimeout(() => setPhase("progress"), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase !== "progress") return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / LOAD_DURATION) * 100));
      setProgress(pct);
      const si = Math.min(cookingSteps.length - 1, Math.floor((pct / 100) * cookingSteps.length));
      setStepIndex(si);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        setTimeout(() => setCurtain(true), 400);
        setTimeout(() => { setHidden(true); onComplete(); }, 1300);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase !== "progress") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string }[] = [];
    const colors = ["#FF7A00", "#FF4500", "#39FF14", "#FFD700"];
    for (let i = 0; i < 80; i++) {
      sparks.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: Math.random(),
        size: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    let running = true;
    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.006;
        if (s.life <= 0) {
          s.x = canvas.width / 2 + (Math.random() - 0.5) * 40;
          s.y = canvas.height / 2 + (Math.random() - 0.5) * 40;
          s.vx = (Math.random() - 0.5) * 4;
          s.vy = (Math.random() - 0.5) * 4;
          s.life = Math.random() * 0.8 + 0.2;
        }
        ctx.save();
        ctx.globalAlpha = s.life * 0.8;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; };
  }, [phase]);

  if (hidden) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#07070A]">

        {/* Curtain reveal: left + right panels slide away */}
        {curtain && (
          <>
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 z-50 bg-[#07070A]"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2 z-50 bg-[#07070A]"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            />
          </>
        )}

        {/* Ambient grid */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Scan line */}
        {phase === "intro" && (
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent z-10 blur-[1px]"
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.1, ease: "linear", repeat: 2 }}
          />
        )}

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">

          {/* ── PHASE: intro → text appear ── */}
          <AnimatePresence>
            {phase !== "intro" && (
              <motion.div
                key="brand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Outer spinning ring */}
                <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
                  {/* Ring 1 */}
                  <div
                    className="absolute rounded-full border-[3px] border-transparent animate-ring-spin"
                    style={{
                      width: 310, height: 310,
                      borderTopColor: "#FF7A00",
                      borderRightColor: "rgba(255,122,0,0.2)",
                    }}
                  />
                  {/* Ring 2 */}
                  <div
                    className="absolute rounded-full border-[2px] border-transparent animate-ring-spin-reverse"
                    style={{
                      width: 280, height: 280,
                      borderTopColor: "#39FF14",
                      borderLeftColor: "rgba(57,255,20,0.2)",
                    }}
                  />
                  {/* Ring 3 dashed accent */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 250, height: 250,
                      border: "1px dashed rgba(255,122,0,0.25)",
                    }}
                  />

                  {/* Mascot */}
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="relative"
                  >
                    <div
                      className="absolute inset-0 rounded-full animate-loader-pulse"
                      style={{
                        background: "radial-gradient(circle, rgba(255,122,0,0.35) 0%, transparent 70%)",
                        transform: "scale(1.3)",
                      }}
                    />
                    <img
                      src={mascotLogo}
                      alt="GOSTO FOOD"
                      className="w-40 h-40 object-cover rounded-full relative z-10"
                      style={{ boxShadow: "0 0 40px rgba(255,122,0,0.6), 0 0 80px rgba(255,122,0,0.3)" }}
                    />
                  </motion.div>

                  {/* Orbiting dot orange */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ animation: "loader-ring-spin 3s linear infinite" }}
                  >
                    <div
                      className="absolute w-3 h-3 rounded-full bg-[#FF7A00] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ boxShadow: "0 0 12px #FF7A00, 0 0 20px rgba(255,122,0,0.6)" }}
                    />
                  </div>
                </div>

                {/* Brand name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-center"
                >
                  <div
                    className="font-bebas tracking-[0.25em] text-6xl md:text-7xl leading-none"
                    style={{
                      background: "linear-gradient(135deg, #FF7A00, #FF4500, #FFD700)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 12px rgba(255,122,0,0.7))",
                    }}
                  >
                    GOSTO FOOD
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-2 mt-2"
                  >
                    <Flame size={14} className="text-[#39FF14] icon-glow-green" />
                    <span
                      className="font-display text-xs font-bold tracking-[0.3em] uppercase"
                      style={{ color: "#39FF14", filter: "drop-shadow(0 0 6px #39FF14)" }}
                    >
                      Fast. Bold. Unforgettable.
                    </span>
                    <Flame size={14} className="text-[#39FF14] icon-glow-green" />
                  </motion.div>
                </motion.div>

                {/* Progress bar */}
                {phase === "progress" || phase === "done" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-72 flex flex-col gap-3"
                  >
                    {/* Status text */}
                    <div className="flex items-center justify-between">
                      <motion.span
                        key={stepIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-bold tracking-[0.25em] uppercase"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {cookingSteps[stepIndex]}
                      </motion.span>
                      <span
                        className="font-bebas text-xl tabular-nums"
                        style={{
                          color: "#FF7A00",
                          filter: "drop-shadow(0 0 8px rgba(255,122,0,0.8))",
                        }}
                      >
                        {progress}%
                      </span>
                    </div>

                    {/* Bar track */}
                    <div
                      className="relative h-[3px] rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: "linear-gradient(90deg, #FF7A00, #FF4500, #39FF14)",
                          boxShadow: "0 0 12px rgba(255,122,0,0.8)",
                          transition: "width 0.05s linear",
                        }}
                      />
                      {/* Shimmer */}
                      <div
                        className="absolute inset-0 rounded-full animate-shimmer"
                        style={{ mixBlendMode: "overlay" }}
                      />
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#FF7A00] opacity-60 rounded-tl-sm" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#FF7A00] opacity-60 rounded-tr-sm" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#39FF14] opacity-60 rounded-bl-sm" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#39FF14] opacity-60 rounded-br-sm" />
      </div>
    </AnimatePresence>
  );
}
