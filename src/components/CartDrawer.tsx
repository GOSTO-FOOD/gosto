import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQty, clearCart, total, openCheckout } = useCart();

  function handleCheckout() {
    onClose();
    openCheckout();
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="font-black text-lg">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, ci) => s + ci.quantity, 0)} items
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="text-6xl">🛒</div>
              <div>
                <p className="font-bold text-lg">Your cart is empty</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Add items from the menu to get started
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-2 rounded-xl font-semibold text-sm"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((ci) => (
              <div
                key={ci.cartId}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3"
              >
                <div className="text-3xl w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  🍔
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{ci.name}</p>
                  {ci.size && (
                    <p className="text-xs text-muted-foreground">{ci.size}</p>
                  )}
                  <p className="text-primary font-black text-sm">
                    {(ci.price * ci.quantity).toLocaleString()} DA
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(ci.cartId, ci.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{ci.quantity}</span>
                  <button
                    onClick={() => updateQty(ci.cartId, ci.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-border transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeItem(ci.cartId)}
                    className="w-7 h-7 rounded-lg ml-1 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">{total.toLocaleString()} DA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery fee</span>
              <span className="font-bold text-green-400">Free</span>
            </div>
            <div className="flex justify-between font-black text-lg border-t border-border pt-3">
              <span>Total</span>
              <span className="text-primary">{total.toLocaleString()} DA</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-base transition-all active:scale-[0.98]"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
