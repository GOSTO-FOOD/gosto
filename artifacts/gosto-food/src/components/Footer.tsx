import { Facebook, Instagram, Phone, MapPin, ChevronRight, UtensilsCrossed } from "lucide-react";
import mascotLogo from "@assets/téléchargement_(2)_1777233502629.png";

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.83 1.56V6.79a4.85 4.85 0 0 1-1.06-.1z"/>
    </svg>
  );
}

const quickLinks = ["Menu", "Offres", "À Propos", "Contact"];

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase().replace("à propos", "about").replace("offres", "offers").replace("menu", "menu").replace("contact", "contact"));
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#030305]">
      {/* Top neon line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, #FF7A00, #39FF14, transparent)" }}
      />

      {/* BG grid */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
        style={{
          width: 800,
          height: 300,
          background: "radial-gradient(ellipse, rgba(255,122,0,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img
                src={mascotLogo}
                alt="GOSTO FOOD"
                className="w-12 h-12 rounded-full object-cover"
                style={{ boxShadow: "0 0 20px rgba(255,122,0,0.5)" }}
              />
              <span
                className="font-bebas text-3xl tracking-[0.12em] text-white"
                style={{ filter: "drop-shadow(0 0 8px rgba(255,122,0,0.6))" }}
              >
                GOSTO <span style={{ color: "#FF7A00" }}>FOOD</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              La street food mexicaine premium en Algérie. Des saveurs qui explosent, une expérience inoubliable.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-1">
              {[
                { icon: Facebook,     label: "Facebook",  href: "https://www.facebook.com/gostofastfood/?locale=fr_FR" },
                { icon: Instagram,   label: "Instagram", href: "https://www.instagram.com/gosto_fast_food/" },
                { icon: TikTokIcon,  label: "TikTok",    href: "https://www.tiktok.com/@gosto_fast_food" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 cut-sm flex items-center justify-center text-white/50 transition-all duration-300 hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(255,122,0,0.18)";
                    el.style.borderColor = "rgba(255,122,0,0.5)";
                    el.style.color = "#FF7A00";
                    el.style.boxShadow = "0 0 15px rgba(255,122,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                    el.style.color = "rgba(255,255,255,0.5)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={15} style={{ color: "#FF7A00" }} />
              <h4 className="font-display font-black text-sm uppercase tracking-[0.2em] text-white/70">
                Navigation
              </h4>
            </div>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo(link)}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-[#FF7A00] transition-colors group w-full text-left"
                  >
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                      style={{ color: "#FF7A00", opacity: 0.6 }}
                    />
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Phone size={15} style={{ color: "#39FF14" }} />
              <h4 className="font-display font-black text-sm uppercase tracking-[0.2em] text-white/70">
                Contact
              </h4>
            </div>
            <div className="flex flex-col gap-3">
              <div
                className="flex items-start gap-3 px-4 py-3 cut-sm"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <MapPin size={16} style={{ color: "#FF7A00", flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm text-white/50 leading-snug">Rue 19 Juin 1965, Lbokhari — Biskra<br />Service de Livraison Disponible</span>
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 cut-sm"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Phone size={16} style={{ color: "#FF7A00", flexShrink: 0 }} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-white/50">0656 92 39 63</span>
                  <span className="text-sm text-white/50">0552 41 40 55</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8 border-t border-white/6">
          <p className="text-xs text-white/25">
            &copy; 2026 GOSTO FOOD — Tous droits réservés.
          </p>
          <p className="text-xs text-white/20 flex items-center gap-1.5">
            <span style={{ color: "#FF7A00", filter: "drop-shadow(0 0 4px #FF7A00)" }}>■</span>
            Fast. Bold. Unforgettable.
          </p>
        </div>
      </div>
    </footer>
  );
}
