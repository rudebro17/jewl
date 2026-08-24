"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Clock, CheckCircle2, HeartHandshake, AlertCircle } from "lucide-react";

export default function PoliciesPage() {
  const sections = [
    {
      id: "order-process",
      title: "Order & Shipping Process",
      icon: <Clock size={24} strokeWidth={1.5} />,
      content: (
        <>
          <p style={{ marginBottom: "1rem" }}>
            Every piece at Freyora Jewel is crafted with intention. Because we do not rely on mass production, please be aware of our timelines.
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>Order Confirmation:</strong> Once you place an order, you will receive an immediate confirmation email. Within 24 hours, our artisans review the order details before casting begins.</li>
            <li><strong>Standard Timeline:</strong> Please expect a <strong>3-4 week timeline</strong> for creation and delivery. Quality takes time, and we ensure every piece meets our strict standards before it leaves the studio.</li>
            <li><strong>Quality Checks:</strong> Before dispatch, your jewelry undergoes a rigorous 3-step quality inspection for metal integrity, stone setting security, and finish perfection.</li>
          </ul>
        </>
      ),
    },
    {
      id: "returns-cancellation",
      title: "Returns & Cancellation",
      icon: <AlertCircle size={24} strokeWidth={1.5} />,
      content: (
        <>
          <p style={{ marginBottom: "1rem" }}>
            We understand that fine jewelry is a significant decision. We offer a transparent cancellation policy.
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>48-Hour Grace Period:</strong> You can cancel your order within 48 hours of placement for a full, no-questions-asked refund. After 48 hours, the casting process begins and cancellations cannot be accepted.</li>
            <li><strong>Returns:</strong> Due to the custom, made-to-order nature of our pieces, we do not accept standard returns. However, if a piece arrives damaged or defective, please contact us within 7 days of delivery for an exchange or repair.</li>
          </ul>
        </>
      ),
    },
    {
      id: "guarantees",
      title: "Our Guarantees",
      icon: <ShieldCheck size={24} strokeWidth={1.5} />,
      content: (
        <>
          <p style={{ marginBottom: "1rem" }}>
            Authenticity and transparency are the bedrock of our brand. When you invest in a Freyora piece, you are investing in verified quality.
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>Metal Purity Verification:</strong> Every piece is hallmarked. Metal purity verification certificates are available upon request for all 18K Gold and 925 Sterling Silver items.</li>
            <li><strong>Gemstone Certification:</strong> All pieces featuring precious or semi-precious stones come with a gemstone certification guarantee, ensuring ethical sourcing and authenticity.</li>
          </ul>
        </>
      ),
    },
    {
      id: "care",
      title: "Care Guidelines",
      icon: <CheckCircle2 size={24} strokeWidth={1.5} />,
      content: (
        <>
          <p style={{ marginBottom: "1rem" }}>
            Fine jewelry is meant to be worn, but it also requires mindful care to last generations.
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>Storage:</strong> Store your pieces in the provided Freyora pouches or a lined jewelry box. Keep away from excessive humidity.</li>
            <li><strong>Cleaning:</strong> Use a soft, lint-free cloth to gently wipe your jewelry after wear. Avoid harsh chemicals, perfumes, and prolonged exposure to chlorinated water.</li>
            <li><strong>Oxidized Silver:</strong> For our gothic pieces with dark finishes, do not use liquid silver polish, as it will strip the intentional oxidation.</li>
          </ul>
        </>
      ),
    },
    {
      id: "grievance",
      title: "Grievance Process",
      icon: <HeartHandshake size={24} strokeWidth={1.5} />,
      content: (
        <>
          <p style={{ marginBottom: "1rem" }}>
            Your satisfaction is our priority. If something isn&apos;t right, we want to fix it.
          </p>
          <p>
            We have an easy grievance process. Simply email us at <strong>tejasvsoni6011@gmail.com</strong> with your order number and a brief description of the issue. Our dedicated support team will acknowledge your email within 24 hours and propose a resolution path within 48 hours.
          </p>
        </>
      ),
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      icon: <AlertCircle size={24} strokeWidth={1.5} />,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Do you ship internationally?</h4>
            <p>Currently, we ship across India. We are working on expanding our logistics to support international shipping very soon.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Can I customize a piece?</h4>
            <p>Yes, we offer custom engravings on select pieces like the Icon Signet. For full bespoke designs, please reach out via our contact page.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Is your silver rhodium plated?</h4>
            <p>We prefer the natural, developing patina of real 925 sterling silver. We do not use rhodium plating unless explicitly requested, allowing the metal to age beautifully with you.</p>
          </div>
        </div>
      ),
    }
  ];

  return (
    <main style={{ background: "var(--color-ivory)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--color-ink)", color: "white", padding: "4rem 0 3rem" }}>
        <div className="container-editorial">
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-gold)", textDecoration: "none", fontFamily: "var(--font-sans)", fontSize: "0.875rem", marginBottom: "2rem", transition: "color 300ms" }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="heading-editorial" style={{ color: "white" }}>
            POLICIES <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>&</span> INFO
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", color: "rgba(255,255,255,0.7)", maxWidth: "500px", marginTop: "1rem" }}>
            Transparency, quality, and commitment. Everything you need to know about how we operate.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-editorial" style={{ padding: "4rem 0 6rem" }}>
        <div style={{ display: "grid", gap: "4rem" }} className="policies-grid">
          {/* Sidebar Navigation */}
          <aside className="policies-nav" style={{ alignSelf: "start", position: "sticky", top: "6rem" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "1.5rem" }}>
              Directory
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-ink)", textDecoration: "none", transition: "color 300ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} style={{ scrollMarginTop: "6rem", borderBottom: "1px solid rgba(26,26,26,0.1)", paddingBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", color: "var(--color-gold)" }}>
                  {sec.icon}
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--color-ink)" }}>{sec.title}</h2>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", color: "var(--color-ink-muted)", lineHeight: 1.8 }}>
                  {sec.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <footer style={{ background: "var(--color-ink)", padding: "2rem 0", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
          © 2026 Freyora Jewel. All rights reserved.
        </p>
      </footer>

      <style jsx>{`
        .policies-grid { grid-template-columns: 1fr; }
        @media (min-width: 1024px) {
          .policies-grid { grid-template-columns: 300px 1fr; gap: 6rem; }
        }
      `}</style>
    </main>
  );
}
