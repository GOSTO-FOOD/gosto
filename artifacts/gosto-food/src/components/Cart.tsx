import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ChevronRight, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQty, total, count, isOpen, closeCart, openCheckout } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
            onClick={closeCart}
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-[420px] flex flex-col"
            style={{
              background: "linear-gradient(170deg, #09090f 0%, #060608 60%, #0a0608 100%)",
              clipPath: "polygon(36px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 36px)",
              borderLeft: "1px solid rgba(255,122,0,0.25)",
              borderTop: "1px solid rgba(255,122,0,0.25)",
            }}
          >
            {/* Animated neon border trace */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="neonTrace" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7A00" stopOpacity="0" />
                  <stop offset="45%" stopColor="#FF7A00" stopOpacity="1" />
                  <stop offset="55%" stopColor="#39FF14" stopOpacity="1" />
                  <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="-1 0"
                    to="1 0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
              <polygon
                points="36,0 420,0 420,900 0,900 0,36"
                fill="none"
                stroke="url(#neonTrace)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                style={{ opacity: 0.7 }}
              />
            </svg>

            {/* Circuit board background pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ zIndex: 0 }}
            >
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M10 10 H50 V30 H30 V50 H10 Z" fill="none" stroke="#FF7A00" strokeWidth="0.5" />
                    <circle cx="10" cy="10" r="2" fill="#FF7A00" />
                    <circle cx="50" cy="10" r="2" fill="#39FF14" />
                    <circle cx="30" cy="50" r="2" fill="#FF7A00" />
                    <path d="M50 30 H60" fill="none" stroke="#39FF14" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit)" />
              </svg>
            </div>

            {/* Scan-line overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 1,
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,122,0,0.015) 3px, rgba(255,122,0,0.015) 4px)",
              }}
            />

            {/* Diagonal cut accent */}
            <div
              className="absolute top-0 left-0 pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon points="0,36 36,0 60,0 60,4 40,4 4,40 0,40" fill="rgba(255,122,0,0.5)" />
                <line x1="0" y1="36" x2="36" y2="0" stroke="#FF7A00" strokeWidth="1.5"
                  style={{ filter: "drop-shadow(0 0 4px #FF7A00)" }} />
              </svg>
            </div>

            {/* ── HEADER ── */}
            <div
              className="relative flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ zIndex: 3, borderBottom: "1px solid rgba(255,122,0,0.12)" }}
            >
              {/* Left: system label */}
              <div className="flex items-center gap-3 pl-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Zap size={13} style={{ color: "#39FF14", filter: "drop-shadow(0 0 5px #39FF14)" }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                      GOSTO — SYS
                    </span>
                  </div>
                  <h2 className="font-bebas text-3xl leading-none tracking-widest text-white mt-0.5">
                    MA COMMANDE
                  </h2>
                </div>
              </div>

              {/* Right: count badge + close */}
              <div className="flex items-center gap-3">
                {count > 0 && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(255,122,0,0.12)",
                      border: "1px solid rgba(255,122,0,0.4)",
                      boxShadow: "0 0 12px rgba(255,122,0,0.25)",
                    }}
                  >
                    <ShoppingBag size={11} style={{ color: "#FF7A00" }} />
                    <span className="font-bebas text-lg leading-none" style={{ color: "#FF7A00" }}>
                      {count}
                    </span>
                  </div>
                )}
                <button
                  onClick={closeCart}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,80,80,0.12)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,80,80,0.4)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#ff5050";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color = "";
                  }}
                >
                  <X size={17} className="text-white/40" />
                </button>
              </div>
            </div>

            {/* ── ITEMS ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5" style={{ zIndex: 3 }}>
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center py-24">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,122,0,0.05)",
                      border: "1px solid rgba(255,122,0,0.2)",
                      clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    }}
                  >
                    <ShoppingBag size={32} style={{ color: "rgba(255,122,0,0.4)" }} />
                  </motion.div>
                  <div>
                    <p className="font-bebas text-2xl tracking-widest text-white/20">PANIER VIDE</p>
                    <p className="text-xs text-white/20 mt-1 font-medium">Ajoutez des articles depuis le menu</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 font-black text-sm uppercase tracking-wider text-white transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #FF7A00, #FF4500)",
                      clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
                      boxShadow: "0 0 20px rgba(255,122,0,0.4)",
                    }}
                  >
                    Voir le Menu
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.cartId}
                      initial={{ opacity: 0, x: 30, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="relative overflow-hidden"
                      style={{
                        background: "rgba(255,122,0,0.035)",
                        border: "1px solid rgba(255,122,0,0.1)",
                        clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
                      }}
                    >
                      {/* Left accent bar */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{
                          background: "linear-gradient(180deg, #FF7A00, #FF4500)",
                          boxShadow: "2px 0 10px rgba(255,122,0,0.4)",
                        }}
                      />

                      <div className="flex items-center gap-3 px-4 py-3 pl-5">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate leading-tight">{item.name}</p>
                          {item.size && (
                            <span
                              className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 mt-1"
                              style={{
                                background: "rgba(255,122,0,0.15)",
                                color: "#FF7A00",
                                clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
                              }}
                            >
                              {item.size}
                            </span>
                          )}
                          <p className="font-bebas text-xl leading-tight mt-1" style={{ color: "#FF7A00" }}>
                            {(item.price * item.quantity).toLocaleString()} DA
                          </p>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => updateQty(item.cartId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white transition-all"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center font-black text-white text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.cartId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-[#FF7A00] transition-all"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeItem(item.cartId)}
                            className="w-7 h-7 flex items-center justify-center ml-1 transition-all"
                            style={{ background: "rgba(255,50,50,0.06)", border: "1px solid rgba(255,50,50,0.15)" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,50,50,0.15)";
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,50,50,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,50,50,0.06)";
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,50,50,0.15)";
                            }}
                          >
                            <Trash2 size={12} className="text-red-400/60" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* ── FOOTER ── */}
            {items.length > 0 && (
              <div
                className="relative flex flex-col gap-3 px-5 py-5 flex-shrink-0"
                style={{ zIndex: 3, borderTop: "1px solid rgba(255,122,0,0.12)" }}
              >
                {/* Total display */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: "rgba(255,122,0,0.06)",
                    border: "1px solid rgba(255,122,0,0.2)",
                    clipPath: "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
                  }}
                >
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">Total à payer</p>
                    <p className="text-[9px] font-medium text-white/20">{count} article{count > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <motion.span
                      key={total}
                      initial={{ scale: 1.15, color: "#fff" }}
                      animate={{ scale: 1, color: "#FF7A00" }}
                      transition={{ duration: 0.3 }}
                      className="font-bebas text-4xl leading-none"
                      style={{ filter: "drop-shadow(0 0 12px rgba(255,122,0,0.8))" }}
                    >
                      {total.toLocaleString()} DA
                    </motion.span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-white/30">
                      + Livraison
                    </span>
                  </div>
                </div>

                {/* Confirm button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={openCheckout}
                  className="relative w-full flex items-center justify-between px-6 py-4 font-black text-white text-sm uppercase tracking-widest overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #FF7A00 0%, #FF4500 100%)",
                    clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
                    boxShadow: "0 0 30px rgba(255,122,0,0.45), 0 8px 24px rgba(255,69,0,0.25)",
                  }}
                >
                  {/* Shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      transform: "skewX(-20deg)",
                      animation: "shimmer 1.5s infinite",
                    }}
                  />
                  <span className="relative z-10">Confirmer la Commande</span>
                  <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Continue shopping */}
                <button
                  onClick={closeCart}
                  className="w-full py-3 text-xs font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  تابع التسوق — Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
