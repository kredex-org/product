"use client";

import { SectionTitle } from "./SectionTitle";

export function ContactSection() {
  return (
    <section id="contact" className="site-section bg-gradient-to-b from-transparent to-[rgba(126,47,208,0.03)]" style={{ padding: "5rem 1.5rem" }}>
      <div className="crypto-container">
        <SectionTitle 
          kicker="Support"
          title="Get in Touch" 
          description="Have questions? We're here to help you navigate decentralized micro-lending."
        />
        <div style={{ maxWidth: "600px", margin: "0 auto", background: "var(--bg-card)", padding: "2.5rem", borderRadius: "1.25rem", boxShadow: "0 12px 32px rgba(0,0,0,0.2)", border: "1px solid var(--border)" }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Name</label>
                <input type="text" placeholder="Jane Doe" style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Email</label>
                <input type="email" placeholder="jane@example.com" style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Message</label>
              <textarea rows={4} placeholder="How can we help you?" style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)", resize: "vertical" }} />
            </div>
            <button type="button" onClick={() => alert("Thanks for reaching out! We will get back to you shortly.")} style={{ background: "linear-gradient(135deg, #7e2fd0, #5a1fad)", color: "#fff", border: "none", padding: "1rem", borderRadius: "0.6rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer", marginTop: "0.5rem", transition: "opacity 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"} onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
              Send Message
            </button>
          </form>
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span role="img" aria-label="email">✉️</span> teamrayosfficial@gmail.com
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span role="img" aria-label="location">📍</span> Global Network
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
