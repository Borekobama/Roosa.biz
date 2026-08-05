"use client";

import { useState } from "react";
import styles from "./Editorial.module.css";

export type FAQItem = { question: string; answer: string };

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <div className={styles.faq}>{items.map((item, index) => { const expanded = open === index; return <div className={styles.faqItem} key={item.question}><h3><button className={styles.faqButton} type="button" aria-expanded={expanded} aria-controls={`editorial-faq-${index}`} onClick={() => setOpen(expanded ? null : index)}><strong>{item.question}</strong><span className={styles.faqIcon} aria-hidden="true">{expanded ? "−" : "+"}</span></button></h3><div className={styles.faqPanel} id={`editorial-faq-${index}`} hidden={!expanded}>{item.answer}</div></div>; })}</div>;
}
