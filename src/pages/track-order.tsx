import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Search, ExternalLink, Package } from "lucide-react";

const RANI_JAYY_TRACK_URL = `/track`;

export default function TrackOrderPage() {
  const [, navigate] = useLocation();
  const [code, setCode] = useState("");

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    window.location.href = `${RANI_JAYY_TRACK_URL}?orderId=${trimmed}`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍔</span>
            <span className="font-black text-lg tracking-tight">
              GOSTO <span className="text-primary">FOOD</span>
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center">
          <Package size={44} className="text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-black mb-2">Track Your Order</h1>
          <p className="text-muted-foreground leading-relaxed">
            Enter your RANI JAYY tracking code to see your order status and driver location in real-time.
          </p>
        </div>

        {/* Tracking Form */}
        <form onSubmit={handleTrack} className="w-full space-y-3">
          <div className="relative">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. RJAB12CD"
              className="w-full bg-card border-2 border-border focus:border-primary rounded-2xl px-5 py-4 text-center font-mono font-bold text-lg tracking-widest uppercase focus:outline-none transition-colors"
              maxLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={18} />
            Track My Order
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 text-muted-foreground text-xs">
          <div className="flex-1 h-px bg-border" />
          <span>or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Direct Link */}
        <a
          href={RANI_JAYY_TRACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
        >
          Open RANI JAYY Tracking Page
          <ExternalLink size={14} />
        </a>

        {/* How it works */}
        <div className="w-full bg-card border border-border rounded-2xl p-5 text-left space-y-3">
          <h3 className="font-bold text-sm">How it works</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="text-primary font-black shrink-0">1</span>
              <span>Place your order — we send it straight to our kitchen.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-black shrink-0">2</span>
              <span>You receive a tracking code on your order confirmation screen.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-black shrink-0">3</span>
              <span>Enter it here or on RANI JAYY to see your driver's location live on a map.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
