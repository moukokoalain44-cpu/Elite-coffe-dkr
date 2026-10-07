import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/catalog";

type CartLine = {
  product: Product;
  quantity: number;
  size: "Petit" | "Moyen" | "Grand";
  milk: "Lait entier" | "Lait d’avoine" | "Lait d’amande" | "Lait de coco";
  extras: string[];
};

type AddOptions = Partial<Pick<CartLine, "size" | "milk" | "extras">>;

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, options?: AddOptions) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (product: Product, options: AddOptions = {}) => {
      const line: CartLine = {
        product,
        quantity: 1,
        size: options.size ?? "Moyen",
        milk: options.milk ?? "Lait entier",
        extras: options.extras ?? [],
      };
      setLines((current) => [...current, line]);
    };
    const removeItem = (index: number) =>
      setLines((current) => current.filter((_, i) => i !== index));
    const updateQuantity = (index: number, quantity: number) => {
      if (quantity <= 0) return removeItem(index);
      setLines((current) => current.map((line, i) => (i === index ? { ...line, quantity } : line)));
    };
    const clearCart = () => setLines([]);
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => {
      const sizeFee = line.size === "Grand" ? 500 : line.size === "Petit" ? -300 : 0;
      const extrasFee = line.extras.length * 300;
      return sum + (line.product.price + sizeFee + extrasFee) * line.quantity;
    }, 0);
    return { lines, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
