import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Minus, Trash2, User, StickyNote,
  UtensilsCrossed, Flame, Layers, ScrollText, Zap,
  Package, CupSoda, Ship, ChefHat, Beef, Cake, Pizza,
  Star, CheckCircle, Loader2, ChevronLeft, ChevronRight,
  Utensils,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { menuData, type MenuItem, type MenuCategory } from "@/data/menuData";

const iconMap: Record<string, React.ElementType> = {
  pizza: Pizza, layers: Layers, ship: Ship, flame: Flame,
  scroll: ScrollText, utensils: ChefHat, zap: Zap,
  package: Package, cup: CupSoda, burger: Beef, cake: Cake,
};

interface DineInCartItem {
  cartId: string;
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  price: number;
  size?: string;
  qty: number;
}

function ItemRow({
  item, category, onAdd,
}: {
  item: MenuItem;
  category: MenuCategory;
  onAdd: (item: MenuItem, category: MenuCategory, size?: string, price?: number) => void;
}) {
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (size?: string, price?: number) => {
    onAdd(item, category, size, price);
    const k = size ?? "default";
    setAdded(k);
    setTimeout(() => setAdded(null), 700);
  };

  return (
    <div
      className="flex flex-col gap-2 p-3 sharp transition-all"
      style={{
        background: `linear-gradient(145deg, ${category.accent}06, rgba(0,0,0,0))`,
        border: `1px solid ${category.accent}18`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm leading-tight truncate">{item.name}</p>
          {item.nameAr && (
            <p className="text-xs text-white/50 font-bold mt-0.5" dir="rtl">{item.nameAr}</p>
          )}
          {item.note && (
            <p className="text-[10px] text-white/30 mt-0.5">{item.note}</p>
          )}
        </div>
        {item.popular && (
          <div
            className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 cut-sm"
            style={{ background: `${category.accent}20`, border: `1px solid ${category.accent}40` }}
          >
            <Star size={7} style={{ color: category.accent }} />
            <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: category.accent }}>
              Top
            </span>
          </div>
        )}
      </div>

      {item.sizes ? (
        <div className="flex flex-col gap-1.5">
          {item.sizes.map((sz) => {
            const k = sz.label;
            const isAdded = added === k;
            return (
              <div key={sz.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 cut-sm"
                    style={{ background: `${category.accent}15`, color: category.accent }}
                  >
                    {sz.label}
                  </span>
                  <span className="font-bebas text-sm leading-none text-white/80">
                    {sz.price.toLocaleString()} DA
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.82 }}
                  onClick={() => handleAdd(sz.label, sz.price)}
                  className="w-6 h-6 sharp flex items-center justify-center transition-all"
                  style={{
                    background: isAdded ? category.accent : `${category.accent}20`,
                    border: `1px solid ${category.accent}40`,
                    boxShadow: isAdded ? `0 0 10px ${category.glow}` : "none",
                  }}
                >
                  <Plus size={11} style={{ color: isAdded ? "#000" : category.accent }} />
                </motion.button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span
            className="font-bebas text-base leading-none"
            style={{ color: category.accent, filter: `drop-shadow(0 0 5px ${category.accent})` }}
          >
            {item.price?.toLocaleString()} DA
          </span>
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => handleAdd(undefined, item.price)}
            className="w-7 h-7 sharp flex items-center justify-center transition-all"
            style={{
              background: added === "default" ? category.accent : `${category.accent}20`,
              border: `1px solid ${category.accent}40`,
              boxShadow: added === "default" ? `0 0 12px ${category.glow}` : "none",
            }}
          >
            <Plus size={13} style={{ color: added === "default" ? "#000" : category.accent }} />
          </motion.button>
        </div>
      )}
    </div>
  );
}

const TABLES = Array.from({ length: 16 }, (_, i) => i + 1);

export default function DineInModal() {
  const { isDineInOpen, closeDineIn } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeCatId, setActiveCatId] = useState(menuData[0].id);
  const [dineItems, setDineItems] = useState<DineInCartItem[]>([]);
  const [form, setForm] = useState({ name: "", table: 0, note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const activeCat = menuData.find((c) => c.id === activeCatId) ?? menuData[0];

  const addDineItem = useCallback(
    (item: MenuItem, category: MenuCategory, size?: string, price?: number) => {
      const cartId = `${item.id}-${size ?? "default"}`;
      const finalPrice = price ?? item.price ?? 0;
      setDineItems((prev) => {
        const ex = prev.find((i) => i.cartId === cartId);
        if (ex) return prev.map((i) => i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i);
        return [
          ...prev,
          { cartId, id: item.id, name: item.name, nameAr: item.nameAr, category: category.name, price: finalPrice, size, qty: 1 },
        ];
      });
    },
    []
  );

  const changeDineQty = (cartId: string, delta: number) => {
    setDineItems((prev) =>
      prev
        .map((i) => i.cartId === cartId ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const dineTotal = dineItems.reduce((s, i) => s + i.price * i.qty, 0);
  const dineCount = dineItems.reduce((s, i) => s + i.qty, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Veuillez entrer votre prénom";
    if (!form.table) e.table = "Veuillez choisir une table";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || sending) return;
    setSending(true);
    try {
      const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const apiBase = BASE
        ? `${window.location.origin}${BASE.replace(/\/[^/]+$/, "")}/api`
        : `${window.location.origin}/api`;

      const res = await fetch(`${apiBase}/gosto/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name.trim(),
          customerPhone: `Table ${form.table}`,
          deliveryAddress: `TABLE ${form.table}`,
          tableNumber: form.table,
          orderType: "dine_in",
          notes: form.note.trim() || null,
          items: dineItems.map((i) => ({
            group: i.category,
            name: i.name,
            size: i.size ?? null,
            price: i.price,
            qty: i.qty,
          })),
          totalAmount: dineTotal,
        }),
      });

      let id = `DI-${Date.now().toString(36).toUpperCase()}`;
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if ((data as { orderId?: string }).orderId) id = (data as { orderId: string }).orderId;
      }
      setOrderId(id);
      setStep(3);
    } catch {
      setOrderId(`DI-${Date.now().toString(36).toUpperCase()}`);
      setStep(3);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    closeDineIn();
    setTimeout(() => {
      setStep(1);
      setDineItems([]);
      setForm({ name: "", table: 0, note: "" });
      setErrors({});
      setOrderId(null);
      setActiveCatId(menuData[0].id);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isDineInOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/88 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 40 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-3 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-[680px] sharp overflow-hidden relative flex flex-col"
              style={{
                background: "rgba(5,5,9,0.99)",
                border: "1px solid rgba(57,255,20,0.25)",
                boxShadow: "0 0 80px rgba(57,255,20,0.07), 0 40px 100px rgba(0,0,0,0.92)",
                maxHeight: "92dvh",
              }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] flex-shrink-0"
                style={{ background: "linear-gradient(90deg, transparent, #39FF14, #FF7A00, transparent)" }}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 sharp flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.3)" }}
                  >
                    <Utensils size={18} style={{ color: "#39FF14", filter: "drop-shadow(0 0 6px #39FF14)" }} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white tracking-wider leading-none">
                      Commander sur Table
                    </h2>
                    <p className="text-white/30 text-xs mt-0.5 uppercase tracking-widest font-bold">
                      {step === 1 && "Étape 1 — Choisir les plats"}
                      {step === 2 && "Étape 2 — Vos informations"}
                      {step === 3 && "Commande confirmée"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Step indicators */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className="w-2 h-2 sharp transition-all"
                        style={{
                          background: step >= s ? "#39FF14" : "rgba(255,255,255,0.12)",
                          boxShadow: step === s ? "0 0 8px #39FF14" : "none",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-9 h-9 sharp flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 min-h-0">
                <AnimatePresence mode="wait">

                  {/* ── STEP 1: Menu ── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-0"
                    >
                      {/* Category tabs */}
                      <div className="px-6 pb-3 border-b border-white/5">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
                          {menuData.map((cat) => {
                            const CatIcon = iconMap[cat.icon] ?? UtensilsCrossed;
                            const isActive = cat.id === activeCatId;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => setActiveCatId(cat.id)}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 sharp font-bold text-[10px] uppercase tracking-wider transition-all snap-start"
                                style={{
                                  background: isActive ? cat.accent : "rgba(255,255,255,0.04)",
                                  border: isActive ? `1px solid ${cat.accent}` : "1px solid rgba(255,255,255,0.07)",
                                  color: isActive ? "#000" : "rgba(255,255,255,0.45)",
                                  boxShadow: isActive ? `0 0 16px ${cat.glow}` : "none",
                                }}
                              >
                                <CatIcon size={12} />
                                <span>{cat.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Category name */}
                      <div className="px-6 pt-4 pb-2 flex items-center gap-2">
                        {(() => {
                          const CatIcon = iconMap[activeCat.icon] ?? UtensilsCrossed;
                          return (
                            <>
                              <CatIcon size={16} style={{ color: activeCat.accent }} />
                              <span
                                className="font-bebas text-xl tracking-wider uppercase"
                                style={{ color: activeCat.accent, filter: `drop-shadow(0 0 6px ${activeCat.accent})` }}
                              >
                                {activeCat.name}
                              </span>
                              <span className="text-white/30 text-xs font-bold" dir="rtl">{activeCat.nameAr}</span>
                            </>
                          );
                        })()}
                      </div>

                      {/* Items grid */}
                      <div className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCat.items.map((item) => (
                          <ItemRow key={item.id} item={item} category={activeCat} onAdd={addDineItem} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: Info ── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                      className="px-6 pb-6 flex flex-col gap-5 pt-2"
                    >
                      {/* Cart summary */}
                      <div
                        className="cut-sm p-4 flex flex-col gap-2 max-h-40 overflow-y-auto"
                        style={{ background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.12)" }}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                          Récapitulatif — {dineCount} article{dineCount > 1 ? "s" : ""}
                        </p>
                        {dineItems.map((item) => (
                          <div key={item.cartId} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => changeDineQty(item.cartId, -1)}
                                  className="w-5 h-5 sharp flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
                                >
                                  <Minus size={9} />
                                </button>
                                <span className="text-xs font-black text-white/60 w-4 text-center">{item.qty}</span>
                                <button
                                  onClick={() => changeDineQty(item.cartId, 1)}
                                  className="w-5 h-5 sharp flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
                                >
                                  <Plus size={9} />
                                </button>
                              </div>
                              <span className="text-white/60 text-xs truncate">
                                {item.name}{item.size ? ` (${item.size})` : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="font-bold text-white text-xs">
                                {(item.price * item.qty).toLocaleString()} DA
                              </span>
                              <button
                                onClick={() => changeDineQty(item.cartId, -item.qty)}
                                className="w-5 h-5 sharp flex items-center justify-center text-red-400/50 hover:text-red-400 transition-all"
                              >
                                <Trash2 size={9} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div
                          className="flex items-center justify-between pt-2 mt-1"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <span className="font-black text-white/40 text-[10px] uppercase tracking-widest">Total</span>
                          <span className="font-bebas text-2xl" style={{ color: "#FF7A00" }}>
                            {dineTotal.toLocaleString()} DA
                          </span>
                        </div>
                      </div>

                      {/* Name field */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          Votre Prénom
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Ex: Ahmed"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3.5 sharp text-sm font-medium text-white placeholder:text-white/15 outline-none transition-all bg-transparent"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: errors.name ? "1px solid rgba(255,80,80,0.6)" : "1px solid rgba(255,255,255,0.08)",
                            }}
                            onFocus={(e) => {
                              if (!errors.name) {
                                e.currentTarget.style.borderColor = "rgba(57,255,20,0.4)";
                                e.currentTarget.style.boxShadow = "0 0 16px rgba(57,255,20,0.06)";
                              }
                            }}
                            onBlur={(e) => {
                              if (!errors.name) {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.boxShadow = "none";
                              }
                            }}
                          />
                        </div>
                        {errors.name && <p className="text-xs text-red-400 font-medium">{errors.name}</p>}
                      </div>

                      {/* Table selection */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            Choisir votre Table
                          </label>
                          {form.table > 0 && (
                            <span
                              className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 sharp"
                              style={{ background: "rgba(57,255,20,0.12)", border: "1px solid rgba(57,255,20,0.35)", color: "#39FF14" }}
                            >
                              Table {form.table} sélectionnée
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-8 gap-1.5">
                          {TABLES.map((t) => {
                            const isSelected = form.table === t;
                            return (
                              <motion.button
                                key={t}
                                whileTap={{ scale: 0.88 }}
                                onClick={() => {
                                  setForm((f) => ({ ...f, table: t }));
                                  setErrors((e) => { const n = { ...e }; delete n.table; return n; });
                                }}
                                className="aspect-square sharp flex flex-col items-center justify-center gap-0.5 transition-all"
                                style={{
                                  background: isSelected ? "rgba(57,255,20,0.15)" : "rgba(255,255,255,0.04)",
                                  border: isSelected ? "1px solid rgba(57,255,20,0.6)" : "1px solid rgba(255,255,255,0.08)",
                                  boxShadow: isSelected ? "0 0 14px rgba(57,255,20,0.25)" : "none",
                                }}
                              >
                                <Utensils
                                  size={10}
                                  style={{ color: isSelected ? "#39FF14" : "rgba(255,255,255,0.25)" }}
                                />
                                <span
                                  className="font-bebas text-sm leading-none"
                                  style={{ color: isSelected ? "#39FF14" : "rgba(255,255,255,0.5)" }}
                                >
                                  {t}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                        {errors.table && <p className="text-xs text-red-400 font-medium">{errors.table}</p>}
                      </div>

                      {/* Note field */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                          <StickyNote size={11} />
                          Note <span className="text-white/20">(optionnel)</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Sans oignons, bien cuit, sauce à part..."
                          value={form.note}
                          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                          className="w-full px-4 py-3 sharp text-sm font-medium text-white placeholder:text-white/15 outline-none transition-all bg-transparent resize-none"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "rgba(57,255,20,0.35)";
                            e.currentTarget.style.boxShadow = "0 0 16px rgba(57,255,20,0.05)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: Done ── */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 py-10 flex flex-col items-center gap-5 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      >
                        <CheckCircle
                          size={72}
                          style={{ color: "#39FF14", filter: "drop-shadow(0 0 24px #39FF14)" }}
                        />
                      </motion.div>

                      <div>
                        <h3 className="font-bebas text-4xl text-white">Commande Envoyée!</h3>
                        <p className="text-white/50 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                          Votre commande pour la <span style={{ color: "#39FF14" }}>Table {form.table}</span> a été
                          transmise à la cuisine.
                        </p>
                      </div>

                      {orderId && (
                        <div
                          className="w-full flex flex-col items-center gap-2 px-5 py-4 sharp"
                          style={{
                            background: "rgba(57,255,20,0.06)",
                            border: "1px solid rgba(57,255,20,0.28)",
                          }}
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                            Numéro de commande
                          </p>
                          <p
                            className="font-mono font-black text-3xl tracking-widest"
                            style={{ color: "#39FF14", filter: "drop-shadow(0 0 10px #39FF14)" }}
                          >
                            {orderId}
                          </p>
                        </div>
                      )}

                      <div
                        className="w-full flex flex-col gap-2 px-4 py-3 cut-sm text-left"
                        style={{ background: "rgba(255,122,0,0.05)", border: "1px solid rgba(255,122,0,0.15)" }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Client</span>
                          <span className="text-sm font-bold text-white">{form.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Table</span>
                          <span className="font-bebas text-xl" style={{ color: "#FF7A00" }}>N° {form.table}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Total</span>
                          <span className="font-bebas text-xl" style={{ color: "#FF7A00" }}>{dineTotal.toLocaleString()} DA</span>
                        </div>
                      </div>

                      <button
                        onClick={handleClose}
                        className="flex items-center gap-2 px-8 py-3.5 sharp font-display font-black text-sm uppercase tracking-wider transition-all hover:scale-[1.03]"
                        style={{
                          background: "linear-gradient(135deg, #FF7A00, #FF4500)",
                          boxShadow: "0 0 24px rgba(255,122,0,0.4)",
                          color: "#fff",
                        }}
                      >
                        Fermer
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {step !== 3 && (
                <div
                  className="px-6 py-4 flex items-center gap-3 flex-shrink-0"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {step === 2 && (
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-5 py-3 sharp font-bold text-sm text-white/40 hover:text-white/70 transition-all uppercase tracking-wider"
                      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <ChevronLeft size={15} />
                      Retour
                    </button>
                  )}

                  {step === 1 && (
                    <>
                      <div className="flex-1 flex items-center gap-2">
                        {dineCount > 0 && (
                          <span
                            className="font-bebas text-lg leading-none"
                            style={{ color: "#FF7A00" }}
                          >
                            {dineCount} article{dineCount > 1 ? "s" : ""} — {dineTotal.toLocaleString()} DA
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (dineCount === 0) return;
                          setStep(2);
                        }}
                        disabled={dineCount === 0}
                        className="flex items-center gap-2 px-7 py-3.5 sharp font-display font-black text-sm text-white uppercase tracking-wider transition-all hover:scale-[1.03] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                          background: dineCount > 0 ? "linear-gradient(135deg, #39FF14, #22cc0e)" : "rgba(255,255,255,0.06)",
                          boxShadow: dineCount > 0 ? "0 0 24px rgba(57,255,20,0.35)" : "none",
                          color: dineCount > 0 ? "#000" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        Continuer
                        <ChevronRight size={15} />
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <button
                      onClick={handleSubmit}
                      disabled={sending}
                      className="flex-1 flex items-center justify-center gap-3 py-3.5 sharp font-display font-black text-sm text-white uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #FF7A00, #FF4500)",
                        boxShadow: "0 0 28px rgba(255,122,0,0.4)",
                      }}
                    >
                      {sending ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Utensils size={16} />
                          Envoyer à la Cuisine
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
