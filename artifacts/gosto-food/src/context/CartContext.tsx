import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  cartId: string;
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  size?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartId" | "quantity">) => void;
  removeItem: (cartId: string) => void;
  updateQty: (cartId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "cartId" | "quantity">) => {
    const cartId = `${item.id}-${item.size ?? "default"}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, cartId, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQty = useCallback((cartId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.cartId !== cartId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.cartId === cartId ? { ...i, quantity: qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        isCheckoutOpen,
        openCheckout: () => {
          setIsOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
