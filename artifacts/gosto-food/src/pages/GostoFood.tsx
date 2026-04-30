import { useState, useEffect, useRef } from "react";
import { CartProvider } from "@/context/CartContext";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuShowcase from "@/components/MenuShowcase";
import SignatureDishes from "@/components/SignatureDishes";
import SpecialOffers from "@/components/SpecialOffers";
import AboutBrand from "@/components/AboutBrand";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const throttleRef = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const now = performance.now();
      if (now - throttleRef.current < 16) return;
      throttleRef.current = now;
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {loaded && (
        <div
          className="pointer-events-none fixed z-[100] rounded-full"
          style={{
            width: 360,
            height: 360,
            left: cursorPos.x - 180,
            top: cursorPos.y - 180,
            background: "radial-gradient(circle, rgba(255,122,0,0.07) 0%, transparent 70%)",
            transition: "left 0.12s ease, top 0.12s ease",
          }}
        />
      )}

      <div
        className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <Navbar />
        <main className="flex-1">
          <Hero />
          <MenuShowcase />
          <SignatureDishes />
          <SpecialOffers />
          <AboutBrand />
        </main>
        <Footer />
      </div>

      {/* Cart drawer + Checkout modal (outside page scroll) */}
      <Cart />
      <Checkout />
    </>
  );
}

export default function GostoFood() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
