import { useState, useEffect } from "react";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import mascotLogo from "@assets/téléchargement_(2)_1777233502629.png";
import { useCart } from "@/context/CartContext";

function HexCartIcon({ count, onClick }: { count: number; onClick: () => void }) {
  const hasItems = count > 0;
  return (
    <button
      onClick={onClick}
      aria-label="Panier"
      className="relative flex items-center justify-center group"
      style={{ width: 48, height: 52 }}
    >
      <svg
        width="48"
        height="52"
        viewBox="0 0 48 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Defs */}
        <defs>
          <filter id="hexGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hexGlowStrong">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer rotating hexagon ring */}
        <g style={{ transformOrigin: "24px 26px", animation: "hex-spin 8s linear infinite" }}>
          <polygon
            points="24,2 44,13 44,39 24,50 4,39 4,13"
            fill="none"
            stroke={hasItems ? "#FF7A00" : "rgba(255,255,255,0.12)"}
            strokeWidth="1"
            strokeDasharray="6 4"
            filter={hasItems ? "url(#hexGlow)" : undefined}
            style={{ transition: "stroke 0.3s" }}
          />
        </g>

        {/* Inner hexagon — counter-rotate */}
        <g style={{ transformOrigin: "24px 26px", animation: "hex-spin-rev 12s linear infinite" }}>
          <polygon
            points="24,8 40,17 40,35 24,44 8,35 8,17"
            fill="rgba(255,122,0,0.04)"
            stroke={hasItems ? "rgba(255,122,0,0.4)" : "rgba(255,255,255,0.06)"}
            strokeWidth="1"
            style={{ transition: "stroke 0.3s" }}
          />
        </g>

        {/* Solid hex fill */}
        <polygon
          points="24,10 38,18 38,34 24,42 10,34 10,18"
          fill="rgba(8,8,14,0.95)"
        />

        {/* Cart body — custom shape */}
        <g filter={hasItems ? "url(#hexGlowStrong)" : undefined}>
          {/* Handle */}
          <path
            d="M17 20 Q17 16 21 16 Q24 16 24 20"
            stroke={hasItems ? "#FF7A00" : "rgba(255,255,255,0.3)"}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            style={{ transition: "stroke 0.3s" }}
          />
          {/* Bag body */}
          <path
            d="M14 20 L15 33 L33 33 L34 20 Z"
            fill="none"
            stroke={hasItems ? "#FF7A00" : "rgba(255,255,255,0.3)"}
            strokeWidth="1.6"
            strokeLinejoin="round"
            style={{ transition: "stroke 0.3s" }}
          />
          {/* Inner lines — circuit detail */}
          {hasItems && (
            <>
              <line x1="20" y1="24" x2="28" y2="24" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="18" y1="28" x2="30" y2="28" stroke="#39FF14" strokeWidth="0.8" strokeOpacity="0.5" />
              <circle cx="24" cy="33" r="1.5" fill="#FF7A00" />
              <circle cx="19" cy="33" r="1.5" fill="#FF7A00" />
              <circle cx="29" cy="33" r="1.5" fill="#FF7A00" />
            </>
          )}
        </g>

        {/* Orbiting dot — only when items */}
        {hasItems && (
          <g style={{ transformOrigin: "24px 26px", animation: "hex-spin 2.5s linear infinite" }}>
            <circle cx="24" cy="4" r="2.5" fill="#FF7A00">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="24" cy="4" r="4" fill="none" stroke="#FF7A00" strokeWidth="0.5" strokeOpacity="0.4">
              <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Count badge */}
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black text-black px-1"
          style={{
            background: "linear-gradient(135deg, #FF7A00, #FF4500)",
            boxShadow: "0 0 10px rgba(255,122,0,0.9), 0 0 20px rgba(255,122,0,0.4)",
            animation: "count-pop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}

      <style>{`
        @keyframes hex-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hex-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes count-pop {
          0%   { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const links = [
    { label: "Menu", id: "menu" },
    { label: "Offres", id: "offers" },
    { label: "À propos", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? "glass-dark border-b border-white/8 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 group"
        >
          <img
            src={mascotLogo}
            alt="GOSTO FOOD"
            className="w-9 h-9 rounded-full object-cover"
            style={{ boxShadow: "0 0 12px rgba(255,122,0,0.6)" }}
          />
          <span
            className="font-bebas text-2xl tracking-[0.12em] text-white group-hover:text-[#FF7A00] transition-colors"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,122,0,0.5))" }}
          >
            GOSTO <span style={{ color: "#FF7A00" }}>FOOD</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="relative text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FF7A00] group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_#FF7A00]" />
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <HexCartIcon count={count} onClick={openCart} />
          <button
            onClick={() => scrollTo("menu")}
            className="flex items-center gap-2 px-6 py-2.5 sharp font-display font-black text-sm text-white uppercase tracking-wider transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #FF7A00, #FF4500)",
              boxShadow: "0 0 20px rgba(255,122,0,0.5)",
            }}
          >
            Commander
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <HexCartIcon count={count} onClick={openCart} />
          <button
            className="w-10 h-10 cut-sm flex items-center justify-center text-white glass border border-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/8 px-4 py-6 flex flex-col gap-2">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="w-full text-left px-4 py-3.5 sharp font-bold text-white uppercase tracking-wider text-sm hover:bg-white/5 hover:text-[#FF7A00] transition-all flex items-center gap-3"
            >
              <UtensilsCrossed size={16} className="text-[#FF7A00]/60" />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
