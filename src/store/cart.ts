import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartAddon } from "@/models/cart";

export type { CartItem, CartAddon } from "@/models/cart";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineTotal">) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  subtotal: () => number;
}

function lineTotal(item: CartItem): number {
  const addonsTotal = item.addons.reduce((s, a) => s + a.price, 0);
  return (item.unitPrice + addonsTotal) * item.quantity;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const newItem: CartItem = { ...item, lineTotal: 0 };
        newItem.lineTotal = lineTotal(newItem);
        set((state) => ({ items: [...state.items, newItem] }));
      },
      updateQuantity: (index, quantity) => {
        if (quantity < 1) {
          set((state) => ({ items: state.items.filter((_, i) => i !== index) }));
          return;
        }
        set((state) => {
          const next = [...state.items];
          next[index] = { ...next[index], quantity, lineTotal: 0 };
          next[index].lineTotal = lineTotal(next[index]);
          return { items: next };
        });
      },
      removeItem: (index) =>
        set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + i.lineTotal, 0),
    }),
    { name: "cafe-cart" }
  )
);
