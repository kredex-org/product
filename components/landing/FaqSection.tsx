"use client";

import { useState } from "react";
import type { FaqItem } from "@/types/landing";

interface FaqSectionProps {
  items: FaqItem[];
}

const CATEGORIES = ["General", "Account", "Wallet and Asset", "Transactions", "Disputes"];

export function FaqSection({ items }: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState("General");
  
  const filteredItems = items.filter(item => (item.category || "General") === activeCategory);

  return (
    <section id="faq" className="section-anchor faq-section">
      <div className="crypto-container py-20">
        <div className="faq-grid">
          <aside className="faq-sidebar">
            <h3 className="heading-md">FAQs</h3>
            <ul className="mt-4 space-y-2">
              {CATEGORIES.map(category => (
                <li 
                  key={category}
                  className={`faq-chip ${activeCategory === category ? "faq-chip-active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                  style={{ cursor: "pointer" }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </aside>

          <article className="faq-main">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <details key={item.question} className="faq-item" open={index === 0}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))
            ) : (
              <p className="text-secondary" style={{ padding: "1rem" }}>No FAQs available for this category yet.</p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
