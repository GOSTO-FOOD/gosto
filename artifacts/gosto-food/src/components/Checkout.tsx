import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, MapPin, MessageCircle, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { items, total, clearCart, isCheckoutOpen, closeCheckout, openCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Veuillez entrer votre nom";
    if (!form.phone.trim()) e.phone = "Veuillez entrer votre téléphone";
    if (!form.address.trim()) e.address = "Veuillez entrer votre adresse";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const orderLines = items
      .map(
        (i) =>
          `• ${i.name}${i.size ? ` (${i.size})` : ""} ×${i.quantity} = ${(i.price * i.quantity).toLocaleString()} DA`
      )
      .join("\n");

    const message = [
      "🍕 *NOUVELLE COMMANDE — GOSTO FOOD* 🍕",
      "━━━━━━━━━━━━━━━━━━━━━",
      `👤 *Nom:* ${form.name}`,
      `📞 *Téléphone:* ${form.phone}`,
      `📍 *Adresse:* ${form.address}`,
      "━━━━━━━━━━━━━━━━━━━━━",
      "*🛒 Articles commandés:*",
      orderLines,
      "━━━━━━━━━━━━━━━━━━━━━",
      `💰 *TOTAL: ${total.toLocaleString()} DA*`,
    ].join("\n");

    const url = `https://wa.me/213656923963?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSent(true);

    setTimeout(() => {
      clearCart();
      closeCheckout();
      setSent(false);
      setForm({ name: "", phone: "", address: "" });
      setErrors({});
    }, 3000);
  };

  const handleClose = () => {
    closeCheckout();
  };

  const handleBack = () => {
    closeCheckout();
    openCart();
  };

  const fields = [
    { icon: User, key: "name", label: "Nom complet", placeholder: "Ex: Ahmed Benali", type: "text" },
    { icon: Phone, key: "phone", label: "Téléphone", placeholder: "Ex: 0656 92 39 63", type: "tel" },
    { icon: MapPin, key: "address", label: "Adresse de livraison", placeholder: "Rue, quartier, ville...", type: "text" },
  ] as const;

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-[520px] sharp overflow-hidden relative flex flex-col max-h-[92vh]"
              style={{
                background: "rgba(6,6,10,0.99)",
                border: "1px solid rgba(255,122,0,0.35)",
                boxShadow: "0 0 80px rgba(255,122,0,0.12), 0 40px 100px rgba(0,0,0,0.9)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #FF7A00, transparent)" }}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-5 flex-shrink-0">
                <div>
                  <h2 className="font-bebas text-4xl text-white tracking-wider leading-none">
                    Finaliser la Commande
                  </h2>
                  <p className="text-white/30 text-sm mt-1">
                    {items.length} article{items.length > 1 ? "s" : ""} — Total:{" "}
                    <span style={{ color: "#FF7A00" }} className="font-bold">
                      {total.toLocaleString()} DA
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 sharp flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {sent ? (
                  <div className="px-7 py-16 flex flex-col items-center gap-5 text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    >
                      <CheckCircle
                        size={72}
                        style={{ color: "#39FF14", filter: "drop-shadow(0 0 24px #39FF14)" }}
                      />
                    </motion.div>
                    <h3 className="font-bebas text-4xl text-white">Commande Envoyée!</h3>
                    <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                      Votre commande a été envoyée sur WhatsApp. Notre équipe vous contactera dans les plus brefs délais.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/30 font-bold uppercase tracking-wider">
                      <span>Fermeture automatique...</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="px-7 pb-7 flex flex-col gap-5">
                    {/* Order Summary */}
                    <div
                      className="cut-sm p-4 flex flex-col gap-2.5 max-h-44 overflow-y-auto"
                      style={{ background: "rgba(255,122,0,0.04)", border: "1px solid rgba(255,122,0,0.12)" }}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                        Récapitulatif
                      </p>
                      {items.map((item) => (
                        <div key={item.cartId} className="flex items-center justify-between gap-4">
                          <span className="text-white/60 text-sm truncate">
                            {item.name}
                            {item.size ? ` (${item.size})` : ""} × {item.quantity}
                          </span>
                          <span className="font-bold text-white text-sm flex-shrink-0">
                            {(item.price * item.quantity).toLocaleString()} DA
                          </span>
                        </div>
                      ))}
                      <div
                        className="flex items-center justify-between pt-2.5 mt-1"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <span className="font-black text-white/50 text-xs uppercase tracking-widest">Total</span>
                        <span className="font-bebas text-2xl" style={{ color: "#FF7A00" }}>
                          {total.toLocaleString()} DA
                        </span>
                      </div>
                    </div>

                    {/* Form fields */}
                    {fields.map((field) => {
                      const Icon = field.icon;
                      return (
                        <div key={field.key} className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            {field.label}
                          </label>
                          <div className="relative">
                            <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              value={form[field.key]}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, [field.key]: e.target.value }))
                              }
                              className="w-full pl-11 pr-4 py-3.5 sharp text-sm font-medium text-white placeholder:text-white/15 outline-none transition-all bg-transparent"
                              style={{
                                background: "rgba(255,255,255,0.035)",
                                border: errors[field.key]
                                  ? "1px solid rgba(255,80,80,0.6)"
                                  : "1px solid rgba(255,255,255,0.08)",
                              }}
                              onFocus={(e) => {
                                if (!errors[field.key]) {
                                  e.currentTarget.style.borderColor = "rgba(255,122,0,0.5)";
                                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255,122,0,0.08)";
                                }
                              }}
                              onBlur={(e) => {
                                if (!errors[field.key]) {
                                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                  e.currentTarget.style.boxShadow = "none";
                                }
                              }}
                            />
                          </div>
                          {errors[field.key] && (
                            <p className="text-xs text-red-400 font-medium">{errors[field.key]}</p>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex flex-col gap-3 mt-2">
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-3 w-full py-4 sharp font-display font-black text-white text-base uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: "linear-gradient(135deg, #25D366, #128C7E)",
                          boxShadow: "0 0 30px rgba(37,211,102,0.35), 0 8px 24px rgba(18,140,126,0.3)",
                        }}
                      >
                        <MessageCircle size={20} />
                        Envoyer sur WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={handleBack}
                        className="w-full py-3 sharp font-bold text-sm uppercase tracking-wider text-white/40 hover:text-white/70 transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        ← Retour au panier
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
