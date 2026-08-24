"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  ShoppingBag, Search, Menu, X, ChevronRight,
  Camera, Tv, Mail, Phone, MapPin,
  ArrowRight, Check,
} from "lucide-react";
import {
  products, collections, featuredProducts,
  getProductsByCollection, formatPrice, type Product,
} from "../data/products";

// ─── SCROLL REVEAL ───────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── TYPES ────────────────────────────────────────────────────
interface CartItem extends Product { qty: number; }

// ═══════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════
function Navbar({ cartCount, onCartClick }: { cartCount: number; onCartClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#philosophy" },
    { label: "Collections", href: "#collections" },
    { label: "Shop", href: "#featured" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 600ms cubic-bezier(0.25,0,0,1)",
          backgroundColor: scrolled ? "rgba(250,247,242,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(26,26,26,0.08)" : "none",
          padding: scrolled ? "0.75rem 0" : "1.25rem 0",
        }}
      >
        <div className="container-editorial" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button
            onClick={() => scrollTo("#home")}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: "0.18em",
              color: "var(--color-ink)",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "color 300ms",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-gold)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink)")}
            aria-label="Freyora Jewel Home"
          >
            freyorajewel
          </button>

          {/* Desktop links */}
          <ul style={{ display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }} className="hide-mobile-nav">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button onClick={() => scrollTo(link.href)} className="nav-link">
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <button
              aria-label="Search"
              style={{ color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms", display: "none" }}
              className="desktop-search"
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-gold)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink)")}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Shopping bag"
              onClick={onCartClick}
              style={{ color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms", position: "relative" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-gold)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-ink)")}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: "-8px", right: "-8px",
                  background: "var(--color-gold)", color: "var(--color-ink)",
                  fontSize: "9px", fontWeight: 700, width: "16px", height: "16px",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-sans)",
                }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button
              style={{ color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms" }}
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "var(--color-ivory)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          transition: "opacity 600ms cubic-bezier(0.25,0,0,1)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        className="mobile-overlay"
      >
        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              style={{
                fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 300,
                color: "var(--color-ink)", background: "none", border: "none", cursor: "pointer",
                transition: "color 300ms",
                transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-gold)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink)")}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div style={{ position: "absolute", bottom: "3rem", display: "flex", gap: "2rem" }}>
          <a href="https://instagram.com" aria-label="Instagram" style={{ color: "var(--color-ink-muted)", transition: "color 300ms" }}>
            <Camera size={20} strokeWidth={1.5} />
          </a>
          <a href="mailto:tejasvsoni6011@gmail.com" aria-label="Email" style={{ color: "var(--color-ink-muted)", transition: "color 300ms" }}>
            <Mail size={20} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .hide-mobile-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .desktop-search { display: flex !important; }
          .mobile-overlay { display: none !important; }
        }
        @media (max-width: 1023px) {
          .hide-mobile-nav { display: none !important; }
          .desktop-search { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════════════════
function CartDrawer({ open, onClose, items, onRemove }: {
  open: boolean; onClose: () => void;
  items: CartItem[]; onRemove: (id: string) => void;
}) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 60,
          background: "rgba(26,26,26,0.4)",
          transition: "opacity 400ms",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed", right: 0, top: 0, bottom: 0,
          width: "100%", maxWidth: "380px",
          background: "var(--color-ivory)", zIndex: 70,
          display: "flex", flexDirection: "column",
          transition: "transform 600ms cubic-bezier(0.25,0,0,1)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: open ? "-20px 0 60px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 300, letterSpacing: "0.05em" }}>Your Bag</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink)", transition: "color 300ms" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-gold)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink)")}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: "1rem" }}>
              <ShoppingBag size={40} strokeWidth={1} style={{ color: "rgba(26,26,26,0.15)" }} />
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "rgba(26,26,26,0.35)", fontWeight: 300 }}>Your bag is empty.</p>
              <button onClick={onClose} className="btn-ghost" style={{ marginTop: "0.5rem" }}>
                Explore Collections <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {items.map((item) => (
                <li key={item.id} style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ width: "72px", height: "88px", background: "var(--color-cream)", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={item.image} alt={item.name} width={72} height={88} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 300 }}>{item.name}</p>
                    <p className="text-eyebrow" style={{ marginTop: "2px" }}>{item.materialDetail}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-gold)", marginTop: "4px", fontWeight: 500 }}>{formatPrice(item.price)}</p>
                    <button
                      onClick={() => onRemove(item.id)}
                      style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--color-ink-muted)", letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", marginTop: "8px", transition: "color 300ms" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink)")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-ink-muted)")}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid rgba(26,26,26,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", fontWeight: 300 }}>{formatPrice(total)}</span>
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Checkout
            </button>
            <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "var(--color-ink-muted)", marginTop: "0.75rem" }}>Taxes and shipping at checkout</p>
          </div>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════
function Hero() {
  const scrollToCollections = () => document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" });
  const scrollToPhilosophy = () => document.querySelector("#philosophy")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      style={{
        position: "relative", minHeight: "100vh",
        background: "var(--color-ivory)", overflow: "hidden",
        display: "flex", alignItems: "center",
      }}
    >
      {/* Grid */}
      <div className="container-editorial" style={{ width: "100%", paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div style={{ display: "grid", gap: "3rem", alignItems: "center" }} className="hero-grid">
          {/* Left */}
          <div className="hero-text" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p className="text-eyebrow" style={{ marginBottom: "2rem" }}>Est. 2024 · New Delhi, India</p>

            <h1 className="heading-display" style={{ color: "var(--color-ink)", marginBottom: "2rem" }}>
              JEWELRY
              <br />
              <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>FOR THE</span>
              <br />
              NEW ERA.
            </h1>

            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "1.125rem",
              color: "var(--color-ink-muted)", maxWidth: "400px",
              lineHeight: 1.7, marginBottom: "2.5rem",
            }}>
              Jewelry rooted in precious metals, reimagined through culture, identity and modern expression. Real gold. Real silver. Real you.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <button className="btn-primary" onClick={scrollToCollections} id="hero-explore-btn">
                Explore Collections <ChevronRight size={16} strokeWidth={1.5} />
              </button>
              <button className="btn-ghost" onClick={scrollToPhilosophy} id="hero-about-btn">
                Our Story <ArrowRight size={14} />
              </button>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: "2.5rem", marginTop: "4rem",
              paddingTop: "2.5rem", borderTop: "1px solid rgba(26,26,26,0.1)",
            }}>
              {[
                { value: "18K", label: "Gold Pieces" },
                { value: "925", label: "Silver Standard" },
                { value: "3", label: "Worlds to Explore" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-gold)", fontWeight: 300 }}>{stat.value}</p>
                  <p className="text-eyebrow" style={{ marginTop: "4px" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="hero-image" style={{ position: "relative" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden" }} className="hero-img-wrap">
              <Image
                src="/assets/hero/hero_main.jpg"
                alt="Freyora Jewel — Jewelry for the New Era"
                fill priority
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            {/* Floating tag */}
            <div style={{
              position: "absolute", bottom: "2rem", left: "2rem",
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "rgba(250,247,242,0.92)", backdropFilter: "blur(8px)",
              padding: "0.75rem 1.25rem", border: "1px solid rgba(26,26,26,0.1)",
            }} className="floating-tag">
              <span className="animate-pulse-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-gold)", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>New Collection Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "var(--color-ink)", color: "var(--color-ivory)",
        padding: "0.75rem 0", overflow: "hidden",
      }} className="marquee-strip">
        <div className="animate-marquee" style={{ display: "flex", whiteSpace: "nowrap" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 3rem" }}>
              Real Gold · Real Silver · Mythology · Gothic · Culture · New Era Jewelry ·
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-grid { grid-template-columns: 1fr; }
        .hero-img-wrap { aspect-ratio: 4/3; }
        .floating-tag { display: none; }
        .marquee-strip { display: none; }
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 1fr; }
          .hero-img-wrap { aspect-ratio: 3/4; height: 85vh; }
          .floating-tag { display: flex; }
          .marquee-strip { display: block; }
          .hero-text { padding-right: 4rem; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// BRAND PHILOSOPHY
// ═══════════════════════════════════════════════════════════════
function BrandPhilosophy() {
  return (
    <section id="philosophy" style={{ background: "var(--color-cream)", overflow: "hidden" }} className="section-pad">
      <div className="container-editorial">
        <div style={{ display: "grid", gap: "4rem", alignItems: "center" }} className="philosophy-grid">
          {/* Image */}
          <div className="reveal philosophy-img" style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
            <Image
              src="/assets/brand/philosophy.jpg"
              alt="Freyora Jewel — Real gold, real stories"
              fill style={{ objectFit: "cover" }}
            />
            <div style={{
              position: "absolute", bottom: "1.5rem", right: "1.5rem",
              background: "var(--color-ink)", color: "var(--color-ivory)",
              padding: "0.5rem 1rem",
            }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>18K · 925</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-gold-eyebrow reveal">Our Philosophy</p>

            <h2 className="heading-section reveal" style={{ color: "var(--color-ink)", marginTop: "1.5rem", transitionDelay: "0.1s" }}>
              REAL METAL.
              <br />
              <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>REAL STORIES.</span>
              <br />
              YOUR ERA.
            </h2>

            <div className="divider-gold reveal" style={{ margin: "2rem 0", transitionDelay: "0.2s" }} />

            <p className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", color: "var(--color-ink-muted)", lineHeight: 1.7, transitionDelay: "0.3s" }}>
              We don&apos;t make accessories. We make extensions of identity — pieces that carry the weight of who you are and where you come from.
            </p>
            <p className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", color: "var(--color-ink-muted)", lineHeight: 1.7, marginTop: "1rem", transitionDelay: "0.4s" }}>
              Every piece is cast in genuine precious metal. No plating. No shortcuts. Real gold, real silver, authentic craftsmanship — designed for a generation that demands both meaning and beauty.
            </p>

            <ul className="reveal" style={{ listStyle: "none", padding: 0, margin: "2.5rem 0 0", display: "flex", flexDirection: "column", gap: "1rem", transitionDelay: "0.5s" }}>
              {[
                "Certified 18K Gold & 925 Sterling Silver",
                "Inspired by mythology, culture & identity",
                "Handcrafted in limited quantities",
                "Jewelry as self-expression, not decoration",
              ].map((point) => (
                <li key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>
                  <span style={{
                    marginTop: "3px", width: "16px", height: "16px", flexShrink: 0,
                    border: "1px solid var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ width: "5px", height: "5px", background: "var(--color-gold)", borderRadius: "50%" }} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .philosophy-grid { grid-template-columns: 1fr; }
        .philosophy-img { order: 2; }
        @media (min-width: 1024px) {
          .philosophy-grid { grid-template-columns: 1fr 1fr; gap: 6rem; }
          .philosophy-img { order: 1; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT CARD
// ═══════════════════════════════════════════════════════════════
function ProductCard({ product, dark = false, onAddToCart }: {
  product: Product; dark?: boolean; onAddToCart: (p: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="product-card-image"
        style={{ background: dark ? "var(--color-gothic-surface)" : "var(--color-cream)" }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{
            objectFit: "cover",
            transition: "transform 700ms cubic-bezier(0.25,0,0,1)",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Tag */}
        {product.tag && (
          <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.25rem 0.6rem",
              background: product.tag === "Sale" ? "rgba(127,29,29,0.85)" : dark ? "rgba(155,163,176,0.2)" : "var(--color-ink)",
              color: dark && product.tag !== "Sale" ? "var(--color-gothic-silver)" : "var(--color-ivory)",
            }}>
              {product.tag}
            </span>
          </div>
        )}

        {/* Add to bag overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem",
          transition: "opacity 400ms, transform 400ms",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
        }}>
          <button
            onClick={handleAdd}
            id={`add-to-bag-${product.id}`}
            style={{
              width: "100%", padding: "0.75rem",
              fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              border: "none", cursor: "pointer",
              transition: "background-color 300ms, color 300ms",
              background: added
                ? "var(--color-gold)"
                : dark ? "var(--color-gothic-silver)" : "var(--color-ink)",
              color: added
                ? "var(--color-ink)"
                : dark ? "var(--color-gothic-bg)" : "var(--color-ivory)",
            }}
          >
            {added ? <><Check size={13} /> Added</> : <><ShoppingBag size={13} /> Add to Bag</>}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div style={{ marginTop: "1rem", padding: "0 4px" }}>
        <p className="text-eyebrow" style={{ color: dark ? "var(--color-gothic-silver)" : "var(--color-ink-muted)" }}>
          {product.collection.toUpperCase()} · {product.category}
        </p>
        <h3 style={{
          fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 300,
          marginTop: "4px", color: dark ? "white" : "var(--color-ink)",
        }}>
          {product.name}
        </h3>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.75rem", marginTop: "2px",
          color: dark ? "var(--color-gothic-silver)" : "var(--color-ink-muted)",
        }}>
          {product.materialDetail}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 500, color: dark ? "var(--color-gold)" : "var(--color-ink)" }}>
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-ink-muted)", textDecoration: "line-through" }}>
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLLECTIONS OVERVIEW
// ═══════════════════════════════════════════════════════════════
function CollectionsOverview() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="collections" style={{ background: "var(--color-parchment)", overflow: "hidden" }} className="section-pad-sm">
      <div className="container-editorial">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p className="text-gold-eyebrow reveal">Three Worlds</p>
          <h2 className="heading-section reveal" style={{ color: "var(--color-ink)", marginTop: "1rem", transitionDelay: "0.1s" }}>
            CHOOSE YOUR UNIVERSE
          </h2>
        </div>

        <div style={{ display: "grid", gap: "2px" }} className="collections-grid">
          {collections.map((col, i) => (
            <button
              key={col.id}
              onClick={() => document.querySelector(`#${col.id}`)?.scrollIntoView({ behavior: "smooth" })}
              id={`nav-collection-${col.id}`}
              className="reveal"
              onMouseEnter={() => setHovered(col.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative", overflow: "hidden", aspectRatio: "3/4",
                border: "none", cursor: "pointer", transitionDelay: `${i * 0.15}s`,
              }}
            >
              <Image
                src={col.banner} alt={col.name} fill
                style={{
                  objectFit: "cover",
                  transition: "transform 700ms cubic-bezier(0.25,0,0,1)",
                  transform: hovered === col.id ? "scale(1.05)" : "scale(1)",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: hovered === col.id
                  ? (col.theme === "dark" ? "rgba(12,12,12,0.35)" : "rgba(26,26,26,0.15)")
                  : (col.theme === "dark" ? "rgba(12,12,12,0.6)" : "rgba(26,26,26,0.35)"),
                transition: "background 400ms",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "2.5rem 1.5rem", display: "flex", flexDirection: "column",
                alignItems: "center", textAlign: "center",
              }}>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "0.5rem",
                  transition: "color 400ms",
                  ...(hovered === col.id ? { color: "var(--color-gold)" } : {}),
                }}>
                  Collection {String(i + 1).padStart(2, "0")}
                </p>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "white" }}>{col.name}</h3>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontStyle: "italic", color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>
                  {col.tagline}
                </p>
                <div style={{
                  marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem",
                  fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
                  transition: "color 400ms, gap 400ms",
                  ...(hovered === col.id ? { color: "var(--color-gold)", gap: "0.75rem" } : {}),
                }}>
                  Explore <ArrowRight size={11} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .collections-grid { grid-template-columns: 1fr; }
        @media (min-width: 768px) { .collections-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MYTHOLOGY SECTION
// ═══════════════════════════════════════════════════════════════
function MythologySection({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const col = collections[0];
  const prods = getProductsByCollection("mythology");

  return (
    <section id="mythology" style={{ background: "var(--color-ivory)", overflow: "hidden" }} className="section-pad">
      <div className="container-editorial">
        <div style={{ display: "grid", gap: "3rem", alignItems: "flex-end", marginBottom: "4rem" }} className="section-header-grid">
          <div>
            <p className="text-gold-eyebrow reveal">Collection 01</p>
            <h2 className="heading-editorial reveal" style={{ color: "var(--color-ink)", marginTop: "1rem", transitionDelay: "0.1s" }}>
              MYTH
              <br />
              <span style={{ fontStyle: "italic" }}>OLOGY</span>
            </h2>
          </div>
          <div className="reveal section-header-right" style={{ transitionDelay: "0.2s" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontStyle: "italic", color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
              &ldquo;{col.tagline}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink-muted)", lineHeight: 1.7, maxWidth: "360px" }}>
              {col.description}
            </p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="reveal" style={{ position: "relative", height: "min(50vw, 70vh)", minHeight: "260px", marginBottom: "4rem", transitionDelay: "0.1s" }}>
        <Image src={col.banner} alt="Mythology Collection — Freyora Jewel" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(250,247,242,0.5) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "2rem", left: "clamp(2rem, 4vw, 4rem)" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "white", textShadow: "0 2px 20px rgba(0,0,0,0.4)", fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>MYTHOLOGY</p>
        </div>
      </div>

      <div className="container-editorial">
        <div style={{ display: "grid", gap: "1.5rem" }} className="products-grid">
          {prods.map((product, i) => (
            <div key={product.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "3rem", textAlign: "center" }} className="reveal">
          <button className="btn-outline" id="mythology-view-all" style={{ display: "inline-flex", gap: "0.75rem" }}>
            View All Mythology <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .section-header-grid { grid-template-columns: 1fr; }
        .section-header-right { text-align: left; }
        .products-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 1024px) {
          .section-header-grid { grid-template-columns: 1fr 1fr; }
          .section-header-right { text-align: right; }
          .products-grid { grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// GOTHIC SECTION
// ═══════════════════════════════════════════════════════════════
function GothicSection({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const col = collections[1];
  const prods = getProductsByCollection("gothic");

  return (
    <section id="gothic" style={{ background: "var(--color-gothic-bg)", overflow: "hidden" }} className="section-pad">
      <div className="container-editorial">
        <div style={{ display: "grid", gap: "3rem", alignItems: "flex-end", marginBottom: "4rem" }} className="section-header-grid">
          <div>
            <p className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-gothic-silver)" }}>
              Collection 02
            </p>
            <h2 className="heading-editorial reveal" style={{ color: "white", marginTop: "1rem", transitionDelay: "0.1s" }}>
              GOTH
              <br />
              <span style={{ fontStyle: "italic", color: "var(--color-gothic-silver)" }}>IC</span>
            </h2>
          </div>
          <div className="reveal section-header-right" style={{ transitionDelay: "0.2s" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontStyle: "italic", color: "var(--color-gothic-silver)", marginBottom: "1rem", opacity: 0.9 }}>
              &ldquo;{col.tagline}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-gothic-silver)", lineHeight: 1.7, maxWidth: "360px", opacity: 0.65 }}>
              {col.description}
            </p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="reveal" style={{ position: "relative", height: "min(50vw, 70vh)", minHeight: "260px", marginBottom: "4rem", transitionDelay: "0.1s" }}>
        <Image src={col.banner} alt="Gothic Collection — Freyora Jewel" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,12,12,0.75) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "2rem", left: "clamp(2rem, 4vw, 4rem)" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "white", fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>GOTHIC</p>
        </div>
      </div>

      <div className="container-editorial">
        <div style={{ display: "grid", gap: "1.5rem" }} className="products-grid">
          {prods.map((product, i) => (
            <div key={product.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <ProductCard product={product} dark onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "3rem", textAlign: "center" }} className="reveal">
          <button
            id="gothic-view-all"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              border: "1px solid var(--color-gothic-silver)", color: "var(--color-gothic-silver)",
              fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.75rem",
              letterSpacing: "0.12em", textTransform: "uppercase", padding: "1rem 2rem",
              background: "transparent", cursor: "pointer",
              transition: "background-color 400ms, color 400ms",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "var(--color-gothic-silver)";
              el.style.color = "var(--color-gothic-bg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "transparent";
              el.style.color = "var(--color-gothic-silver)";
            }}
          >
            View All Gothic <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .section-header-grid { grid-template-columns: 1fr; }
        .section-header-right { text-align: left; }
        .products-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 1024px) {
          .section-header-grid { grid-template-columns: 1fr 1fr; }
          .section-header-right { text-align: right; }
          .products-grid { grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CULTURE SECTION
// ═══════════════════════════════════════════════════════════════
function CultureSection({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const col = collections[2];
  const prods = getProductsByCollection("culture");

  return (
    <section id="culture" style={{ background: "var(--color-cream)", overflow: "hidden" }} className="section-pad">
      <div className="container-editorial">
        <div style={{ display: "grid", gap: "3rem", alignItems: "flex-end", marginBottom: "4rem" }} className="section-header-grid">
          <div>
            <p className="text-gold-eyebrow reveal">Collection 03</p>
            <h2 className="heading-editorial reveal" style={{ color: "var(--color-ink)", marginTop: "1rem", transitionDelay: "0.1s" }}>
              CUL
              <br />
              <span style={{ fontStyle: "italic" }}>TURE</span>
            </h2>
          </div>
          <div className="reveal section-header-right" style={{ transitionDelay: "0.2s" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontStyle: "italic", color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
              &ldquo;{col.tagline}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink-muted)", lineHeight: 1.7, maxWidth: "360px" }}>
              {col.description}
            </p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="reveal" style={{ position: "relative", height: "min(50vw, 70vh)", minHeight: "260px", marginBottom: "4rem", transitionDelay: "0.1s" }}>
        <Image src={col.banner} alt="Culture Collection — Freyora Jewel" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(245,239,228,0.55) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "2rem", left: "clamp(2rem, 4vw, 4rem)" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "var(--color-ink)", fontSize: "clamp(2.5rem, 5vw, 5rem)", textShadow: "0 1px 10px rgba(245,239,228,0.5)" }}>CULTURE</p>
        </div>
      </div>

      <div className="container-editorial">
        <div style={{ display: "grid", gap: "1.5rem" }} className="products-grid">
          {prods.map((product, i) => (
            <div key={product.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "3rem", textAlign: "center" }} className="reveal">
          <button className="btn-outline" id="culture-view-all" style={{ display: "inline-flex", gap: "0.75rem" }}>
            View All Culture <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .section-header-grid { grid-template-columns: 1fr; }
        .section-header-right { text-align: left; }
        .products-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 1024px) {
          .section-header-grid { grid-template-columns: 1fr 1fr; }
          .section-header-right { text-align: right; }
          .products-grid { grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FEATURED PRODUCTS
// ═══════════════════════════════════════════════════════════════
function FeaturedProducts({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  return (
    <section id="featured" style={{ background: "var(--color-ivory)", overflow: "hidden" }} className="section-pad">
      <div className="container-editorial">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", marginBottom: "4rem" }}>
          <div>
            <p className="text-gold-eyebrow reveal">Editor&apos;s Selection</p>
            <h2 className="heading-section reveal" style={{ color: "var(--color-ink)", marginTop: "1rem", transitionDelay: "0.1s" }}>
              THE PIECES EVERYONE&apos;S
              <br />
              TALKING ABOUT.
            </h2>
          </div>
          <button className="btn-ghost reveal" style={{ transitionDelay: "0.2s" }}>
            View All Pieces <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }} className="featured-grid">
          {featuredProducts.slice(0, 6).map((product, i) => (
            <div
              key={product.id}
              className={`reveal ${i === 0 ? "featured-hero" : ""}`}
              style={{ transitionDelay: `${i * 0.09}s` }}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .featured-grid { grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 1024px) {
          .featured-grid { grid-template-columns: repeat(4, 1fr); gap: 2rem; }
          .featured-hero { grid-column: span 2; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// BRAND STATEMENT
// ═══════════════════════════════════════════════════════════════
function BrandStatement() {
  return (
    <section style={{ position: "relative", background: "var(--color-ink)", color: "white", overflow: "hidden" }} className="section-pad">
      <div style={{ position: "absolute", inset: 0, opacity: 0.08 }} aria-hidden>
        <Image src="/assets/collections/mythology/banner.jpg" alt="" fill style={{ objectFit: "cover", mixBlendMode: "luminosity" }} />
      </div>

      <div className="container-narrow" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <p className="text-gold-eyebrow reveal" style={{ marginBottom: "2rem" }}>A Statement</p>
        <h2
          className="heading-editorial reveal"
          style={{ color: "white", transitionDelay: "0.1s" }}
        >
          JEWELRY WAS NEVER
          <br />
          <span style={{ fontStyle: "italic", color: "var(--color-gold)" }}>MEANT TO BE</span>
          <br />
          ORDINARY.
        </h2>

        <div className="divider-gold reveal" style={{ margin: "2.5rem auto", transitionDelay: "0.2s" }} />

        <p className="reveal" style={{
          fontFamily: "var(--font-sans)", fontSize: "1.125rem", color: "rgba(255,255,255,0.55)",
          maxWidth: "520px", margin: "0 auto", lineHeight: 1.7, transitionDelay: "0.3s",
        }}>
          We make pieces for people who wear their interests, stories, obsessions and identities. Precious metals for a generation that wants jewelry to mean something.
        </p>

        <div className="reveal" style={{ marginTop: "3rem", transitionDelay: "0.4s" }}>
          <button
            className="btn-gold"
            id="statement-discover-btn"
            onClick={() => document.querySelector("#collections")?.scrollIntoView({ behavior: "smooth" })}
          >
            Discover the Collection <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Please enter your name.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Please enter a valid email.";
    if (!formData.subject.trim()) e.subject = "Please enter a subject.";
    if (formData.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (!Object.keys(errs).length) {
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
    }
  };

  const contactInfo = [
    { Icon: Mail, label: "Email", value: "tejasvsoni6011@gmail.com" },
    { Icon: Phone, label: "Phone", value: "8824077380" },
    { Icon: MapPin, label: "Studio", value: "Jaipur, Rajasthan" },
  ];

  return (
    <section id="contact" style={{ background: "var(--color-ivory)", overflow: "hidden" }} className="section-pad">
      <div className="container-editorial">
        <div style={{ display: "grid", gap: "4rem" }} className="contact-grid">
          {/* Left */}
          <div>
            <p className="text-gold-eyebrow reveal">Get in Touch</p>
            <h2 className="heading-section reveal" style={{ color: "var(--color-ink)", margin: "1rem 0 2rem", transitionDelay: "0.1s" }}>LET&apos;S TALK.</h2>
            <p className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "1.125rem", color: "var(--color-ink-muted)", lineHeight: 1.7, transitionDelay: "0.2s" }}>
              Questions, collaborations, custom jewelry requests, or just want to say something? We&apos;re always listening.
            </p>

            <div className="reveal" style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem", transitionDelay: "0.3s" }}>
              {contactInfo.map(({ Icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "40px", height: "40px", border: "1px solid rgba(26,26,26,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={16} strokeWidth={1.5} style={{ color: "var(--color-gold)" }} />
                  </div>
                  <div>
                    <p className="text-eyebrow">{label}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink)", marginTop: "2px" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="reveal" style={{ transitionDelay: "0.2s" }}>
            {submitted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", textAlign: "center", gap: "1.25rem" }}>
                <div style={{ width: "64px", height: "64px", border: "2px solid var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={24} strokeWidth={1.5} style={{ color: "var(--color-gold)" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300 }}>Message sent.</h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink-muted)", maxWidth: "280px" }}>
                  We&apos;ll get back to you within 24 hours. Thank you for reaching out.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {[
                  { id: "contact-name", type: "text", placeholder: "Your Name", key: "name" as const, label: "Name" },
                  { id: "contact-email", type: "email", placeholder: "Email Address", key: "email" as const, label: "Email" },
                  { id: "contact-subject", type: "text", placeholder: "Subject", key: "subject" as const, label: "Subject" },
                ].map(({ id, type, placeholder, key, label }) => (
                  <div key={key}>
                    <input
                      id={id} type={type} placeholder={placeholder}
                      className="form-input" aria-label={label}
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    />
                    {errors[key] && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#b91c1c", marginTop: "4px" }}>{errors[key]}</p>}
                  </div>
                ))}
                <div>
                  <textarea
                    id="contact-message" rows={5} placeholder="Your message…"
                    className="form-input" aria-label="Message"
                    style={{ resize: "none" }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  {errors.message && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#b91c1c", marginTop: "4px" }}>{errors.message}</p>}
                </div>
                <button
                  type="submit" id="contact-submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ justifyContent: "center", width: "100%", opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-grid { grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .contact-grid { grid-template-columns: 1fr 1fr; gap: 6rem; } }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) setSubscribed(true);
  };

  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer style={{ background: "var(--color-ink)", color: "white", overflow: "hidden" }}>
      <div className="container-editorial" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ display: "grid", gap: "3rem" }} className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, letterSpacing: "0.15em", marginBottom: "1rem", textTransform: "lowercase" }}>freyorajewel</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "280px" }}>
              Real gold and silver jewelry for a new generation. Inspired by mythology, gothic culture, and modern identity.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem" }}>
              {[
                { Icon: Camera, label: "Instagram", href: "https://instagram.com" },
                { Icon: Tv, label: "YouTube", href: "https://youtube.com" },
                { Icon: Mail, label: "Email", href: "mailto:tejasvsoni6011@gmail.com" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label} href={href} aria-label={label}
                  style={{
                    width: "36px", height: "36px", border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.45)", transition: "color 300ms, border-color 300ms",
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = "var(--color-gold)"; el.style.borderColor = "var(--color-gold)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = "rgba(255,255,255,0.45)"; el.style.borderColor = "rgba(255,255,255,0.15)"; }}
                >
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "1.5rem" }}>Explore</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Home", "About", "Collections", "Shop", "Contact"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo(`#${item.toLowerCase()}`)}
                    style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms", padding: 0 }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "1.5rem" }}>Collections</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Mythology", "Gothic", "Culture"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo(`#${item.toLowerCase()}`)}
                    style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms", padding: 0 }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-gold)", marginBottom: "1.5rem" }}>Customer</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Shipping", "Returns", "Care Guide", "FAQs"].map((item) => (
                <li key={item}>
                  <button
                    style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer", transition: "color 300ms", padding: 0 }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gap: "2rem" }} className="newsletter-grid">
          <div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 300 }}>Stay in the loop.</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", marginTop: "0.5rem" }}>
              New drops, mythology tales and culture moments — straight to your inbox.
            </p>
          </div>
          {subscribed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-gold)" }}>
              <Check size={16} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>You&apos;re subscribed. Welcome to Freyora Jewel.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", maxWidth: "400px" }}>
              <input
                id="footer-newsletter" type="email" placeholder="Enter your email"
                className="form-input-gothic" aria-label="Newsletter email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ fontSize: "0.8rem" }}
              />
              <button
                type="submit" id="footer-subscribe-btn"
                style={{
                  background: "var(--color-gold)", color: "var(--color-ink)",
                  fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.7rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "0 1.25rem", border: "none", cursor: "pointer",
                  flexShrink: 0, transition: "background-color 300ms",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-gold-light)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "var(--color-gold)")}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container-editorial" style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>
            © 2026 Freyora Jewel. All rights reserved. Made in India.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>
            18K Gold · 925 Sterling Silver · Real. Always.
          </p>
        </div>
      </div>

      <style jsx>{`
        .footer-grid { grid-template-columns: 1fr 1fr; }
        .footer-brand { grid-column: span 2; }
        .newsletter-grid { grid-template-columns: 1fr; }
        @media (min-width: 1024px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
          .footer-brand { grid-column: span 1; }
          .newsletter-grid { grid-template-columns: 1fr 1fr; align-items: center; }
        }
      `}</style>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
  useScrollReveal();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((prev) => prev.filter((i) => i.id !== id)), []);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <main>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={removeFromCart} />
      <Hero />
      <BrandPhilosophy />
      <CollectionsOverview />
      <MythologySection onAddToCart={addToCart} />
      <GothicSection onAddToCart={addToCart} />
      <CultureSection onAddToCart={addToCart} />
      <FeaturedProducts onAddToCart={addToCart} />
      <BrandStatement />
      <Contact />
      <Footer />
    </main>
  );
}
