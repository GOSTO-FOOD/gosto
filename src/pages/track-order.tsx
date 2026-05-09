import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Package, Clock, ChefHat, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface OrderItem {
  name: string;
  size: string | null;
  qty: number;
  price: number;
  group: string;
}

interface Order {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: { toDate?: () => Date } | null;
}

const STATUS_CONFIG: Record<string, { label: string; labelAr: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: {
    label: "En attente",
    labelAr: "قيد الانتظار",
    icon: Clock,
    color: "#FF7A00",
    bg: "rgba(255,122,0,0.1)",
  },
  preparing: {
    label: "En préparation",
    labelAr: "قيد التحضير",
    icon: ChefHat,
    color: "#FFD700",
    bg: "rgba(255,215,0,0.1)",
  },
  ready: {
    label: "Prêt",
    labelAr: "جاهز",
    icon: Package,
    color: "#39FF14",
    bg: "rgba(57,255,20,0.1)",
  },
  delivered: {
    label: "Livré",
    labelAr: "تم التسليم",
    icon: CheckCircle,
    color: "#39FF14",
    bg: "rgba(57,255,20,0.1)",
  },
  cancelled: {
    label: "Annulé",
    labelAr: "ملغى",
    icon: XCircle,
    color: "#FF5050",
    bg: "rgba(255,80,80,0.1)",
  },
};

const STEPS = ["pending", "preparing", "ready", "delivered"];

export default function TrackOrderPage() {
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("orderId") ?? "";

  useEffect(() => {
    if (!orderId) {
      setError("Aucun code de commande fourni.");
      setLoading(false);
      return;
    }

    const ref = doc(db, "orders", orderId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setError("Commande introuvable. Vérifiez votre code.");
          setLoading(false);
          return;
        }
        setOrder(snap.data() as Order);
        setLoading(false);
        setError(null);
      },
      () => {
        setError("Impossible de charger la commande. Vérifiez votre connexion.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, [orderId]);

  const statusCfg = order ? (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending) : null;
  const currentStepIdx = order ? STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen" style={{ background: "#07070A", color: "#fff" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center gap-3 px-5 h-14"
        style={{ background: "rgba(7,7,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center w-9 h-9 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <span
          className="font-bebas tracking-widest text-xl"
          style={{ background: "linear-gradient(135deg,#FF7A00,#FF4500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          GOSTO FOOD — Suivi Commande
        </span>
      </header>

      <div className="max-w-lg mx-auto px-4 py-10 flex flex-col gap-6">
        {/* Order ID */}
        {orderId && (
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Code commande</p>
            <p className="font-mono font-black text-2xl tracking-widest" style={{ color: "#FF7A00" }}>
              {orderId}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 size={36} className="animate-spin" style={{ color: "#FF7A00" }} />
            <p className="text-white/40 text-sm">Chargement en cours...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            className="flex flex-col items-center gap-3 py-10 px-6 text-center"
            style={{ background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.3)" }}
          >
            <XCircle size={40} style={{ color: "#FF5050" }} />
            <p className="font-bold text-red-300">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-5 py-2.5 text-sm font-black uppercase tracking-wider transition-all"
              style={{ background: "rgba(255,122,0,0.12)", border: "1px solid rgba(255,122,0,0.4)", color: "#FF7A00" }}
            >
              Retour à l'accueil
            </button>
          </div>
        )}

        {/* Order content */}
        {order && statusCfg && !loading && (
          <>
            {/* Status Card */}
            <div
              className="flex items-center gap-4 px-5 py-5"
              style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.color}40` }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                style={{ background: `${statusCfg.color}18`, border: `1px solid ${statusCfg.color}40` }}
              >
                <statusCfg.icon size={28} style={{ color: statusCfg.color }} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-0.5">Statut actuel</p>
                <p className="font-bebas text-3xl leading-none" style={{ color: statusCfg.color }}>
                  {statusCfg.label}
                </p>
                <p className="text-white/40 text-sm mt-0.5">{statusCfg.labelAr}</p>
              </div>
            </div>

            {/* Progress Steps */}
            {!isCancelled && (
              <div className="flex items-center gap-0">
                {STEPS.map((step, i) => {
                  const cfg = STATUS_CONFIG[step];
                  const done = currentStepIdx >= i;
                  const active = currentStepIdx === i;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className="w-8 h-8 flex items-center justify-center transition-all"
                          style={{
                            background: done ? `${cfg.color}20` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${done ? cfg.color : "rgba(255,255,255,0.1)"}`,
                            boxShadow: active ? `0 0 12px ${cfg.color}60` : "none",
                          }}
                        >
                          <cfg.icon size={14} style={{ color: done ? cfg.color : "rgba(255,255,255,0.2)" }} />
                        </div>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{ color: done ? cfg.color : "rgba(255,255,255,0.2)" }}
                        >
                          {cfg.labelAr}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className="flex-1 h-[1px] mx-1 mb-4"
                          style={{ background: currentStepIdx > i ? "rgba(255,122,0,0.5)" : "rgba(255,255,255,0.08)" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Customer Info */}
            <div
              className="flex flex-col gap-3 px-5 py-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Informations client</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Nom</p>
                  <p className="font-bold text-white">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Téléphone</p>
                  <p className="font-bold text-white">{order.customerPhone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Adresse</p>
                  <p className="font-bold text-white">{order.deliveryAddress}</p>
                </div>
                {order.notes && (
                  <div className="col-span-2">
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Notes</p>
                    <p className="text-white/70">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div
              className="flex flex-col gap-2 px-5 py-4"
              style={{ background: "rgba(255,122,0,0.03)", border: "1px solid rgba(255,122,0,0.1)" }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-1">Articles commandés</p>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/70">
                    {item.name}
                    {item.size ? ` (${item.size})` : ""} × {item.qty}
                  </span>
                  <span className="font-bold text-white flex-shrink-0">
                    {(item.price * item.qty).toLocaleString()} DA
                  </span>
                </div>
              ))}
              <div
                className="flex items-center justify-between pt-3 mt-1"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-white/40 text-xs font-black uppercase tracking-widest">Total</span>
                <span className="font-bebas text-2xl" style={{ color: "#FF7A00" }}>
                  {order.totalAmount.toLocaleString()} DA
                </span>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 font-black uppercase tracking-widest text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
            >
              ← Retour à l'accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
}
