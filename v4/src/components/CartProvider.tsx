"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/content";

export type CartItem = { product: Product; quantity: number };
type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const storageReady = useRef(false);

  useEffect(() => {
    let storedItems: CartItem[] | null = null;
    try {
      const stored = window.localStorage.getItem("roosa-cart");
      if (stored) storedItems = JSON.parse(stored);
    } catch { /* Invalid or disabled storage should not break shopping. */ }
    const frame = window.requestAnimationFrame(() => {
      storageReady.current = true;
      if (storedItems) setItems(storedItems);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageReady.current) return;
    try { window.localStorage.setItem("roosa-cart", JSON.stringify(items)); } catch { /* no-op */ }
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      return existing
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + Math.max(1, quantity) } : item)
        : [...current, { product, quantity: Math.max(1, quantity) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => setItems((current) => current.filter((item) => item.product.id !== productId)), []);
  const setQuantity = useCallback((productId: string, quantity: number) => setItems((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)), []);
  const value = useMemo(() => ({ items, isOpen, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false), addItem, removeItem, setQuantity }), [items, isOpen, addItem, removeItem, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
