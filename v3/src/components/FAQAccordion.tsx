"use client";

import { useState } from "react";
import styles from "@/app/[locale]/editorial.module.css";

export type FAQItem = { question: string; answer: string };

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <div className={styles.faq}>{items.map((item, index) => { const expanded = open === index; return <div className={styles.faqItem} key={item.question}><h3><button className={styles.faqButton} type="button" aria-expanded={expanded} aria-controls={`faq-panel-${index}`} onClick={() => setOpen(expanded ? null : index)}><strong>{item.question}</strong><span className={styles.faqIcon} aria-hidden="true">{expanded ? "−" : "+"}</span></button></h3><div className={styles.faqPanel} id={`faq-panel-${index}`} hidden={!expanded}>{item.answer}</div></div>; })}</div>;
}
