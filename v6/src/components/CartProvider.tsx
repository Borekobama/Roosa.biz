"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/content";
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
const MAX_QUANTITY = 20;
const REACT_CART_KEY = "roosa-cart";
const STATIC_CART_KEY = "roosa-v2-demo-cart";

function normalizeQuantity(value: unknown) {
  const quantity = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : 1;
  return Math.min(MAX_QUANTITY, Math.max(1, quantity));
}

function parseStoredItems(value: string): CartItem[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.slice(0, 20).flatMap((item): CartItem[] => {
    if (!item || typeof item !== "object") return [];
    const stored = item as { product?: { id?: unknown }; quantity?: unknown };
    const product = products.find((candidate) => candidate.id === stored.product?.id);
    return product ? [{ product, quantity: normalizeQuantity(stored.quantity) }] : [];
  });
}

function parseStoredStaticItems(value: string): CartItem[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.slice(0, 20).flatMap((item): CartItem[] => {
    if (!item || typeof item !== "object") return [];
    const stored = item as { id?: unknown; quantity?: unknown };
    const product = products.find((candidate) => candidate.id === stored.id);
    return product ? [{ product, quantity: normalizeQuantity(stored.quantity) }] : [];
  });
}

function toStaticItems(items: CartItem[]) {
  return items.map(({ product, quantity }) => ({
    id: product.id,
    name: product.name,
    price: product.displayPrice,
    unitPrice: product.unitAmount ?? (Number.parseFloat(product.displayPrice.replace(/[^0-9.]/g, "")) || 0),
    pack: `${product.packSize} · ${product.rolls} rolls`,
    image: product.image,
    quantity,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const storageReady = useRef(false);

  useEffect(() => {
    let storedItems: CartItem[] | null = null;
    try {
      const storedReact = window.localStorage.getItem(REACT_CART_KEY);
      const storedStatic = window.localStorage.getItem(STATIC_CART_KEY);
      if (storedReact) storedItems = parseStoredItems(storedReact);
      if (!storedItems?.length && storedStatic) storedItems = parseStoredStaticItems(storedStatic);
    } catch { /* Invalid or disabled storage should not break shopping. */ }
    const frame = window.requestAnimationFrame(() => {
      storageReady.current = true;
      if (storedItems) setItems(storedItems);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageReady.current) return;
    try {
      window.localStorage.setItem(REACT_CART_KEY, JSON.stringify(items));
      window.localStorage.setItem(STATIC_CART_KEY, JSON.stringify(toStaticItems(items)));
    } catch { /* no-op */ }
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      return existing
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: normalizeQuantity(item.quantity + quantity) } : item)
        : [...current, { product, quantity: normalizeQuantity(quantity) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => setItems((current) => current.filter((item) => item.product.id !== productId)), []);
  const setQuantity = useCallback((productId: string, quantity: number) => setItems((current) => current.map((item) => item.product.id === productId ? { ...item, quantity: normalizeQuantity(quantity) } : item)), []);
  const value = useMemo(() => ({ items, isOpen, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false), addItem, removeItem, setQuantity }), [items, isOpen, addItem, removeItem, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
