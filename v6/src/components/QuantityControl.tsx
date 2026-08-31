"use client";

import { Minus, Plus } from "@/components/icons";
import styles from "@/components/Commerce.module.css";

const MAX_QUANTITY = 20;

type QuantityControlProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  productName?: string;
};

export function QuantityControl({ quantity, onChange, productName = "product" }: QuantityControlProps) {
  const safeQuantity = Math.min(MAX_QUANTITY, Math.max(1, quantity));

  return (
    <div className={styles.quantity} role="group" aria-label={`Quantity for ${productName}`}>
      <button
        className={styles.quantityButton}
        type="button"
        onClick={() => onChange(Math.max(1, safeQuantity - 1))}
        disabled={safeQuantity <= 1}
        aria-label={`Decrease ${productName} quantity`}
      >
        <Minus aria-hidden="true" size={18} />
      </button>
      <output className={styles.quantityValue} aria-live="polite" aria-label={`Quantity for ${productName}`}>
        {safeQuantity}
      </output>
      <button
        className={styles.quantityButton}
        type="button"
        onClick={() => onChange(Math.min(MAX_QUANTITY, safeQuantity + 1))}
        disabled={safeQuantity >= MAX_QUANTITY}
        aria-label={`Increase ${productName} quantity`}
      >
        <Plus aria-hidden="true" size={18} />
      </button>
    </div>
  );
}
