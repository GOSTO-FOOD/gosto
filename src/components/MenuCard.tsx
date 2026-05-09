import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/lib/menu";
import { useCart } from "@/context/CartContext";

export default function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((ci) => ci.id === String(item.id));

  function handleAdd() {
    addItem({
      id: String(item.id),
      name: item.name,
      category: item.category ?? "",
      price: item.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/40 transition-all group">
      <div className="w-full h-28 bg-secondary rounded-xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
        {item.emoji}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
          {item.popular && (
            <span className="shrink-0 text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              Popular
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-black text-lg text-primary">{item.price}</span>
          <span className="text-xs text-muted-foreground ml-1">DA</span>
          {inCart && (
            <span className="ml-2 text-xs text-muted-foreground">×{inCart.quantity} in cart</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            added
              ? "bg-green-500 text-white"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {added ? <Check size={14} /> : <Plus size={14} />}
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}
