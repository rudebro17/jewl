"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Plus, Edit2, Trash2, Save, X,
  Star, Tag, Package, ShoppingBag, LayoutGrid, Eye, Upload
} from "lucide-react";
import type { Product } from "../../data/products";
import { storage } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// ─── Constants ────────────────────────────────────────────────
const COLLECTIONS = ["mythology", "gothic", "culture"] as const;
const CATEGORIES = ["Rings", "Necklaces", "Bracelets", "Earrings", "Pendants"] as const;
const MATERIALS = ["Sterling Silver", "18K Gold", "18K White Gold", "Rose Gold"] as const;
const TAGS = ["", "New", "Bestseller", "Limited", "Sale"] as const;

const COLLECTION_LABELS: Record<string, string> = {
  mythology: "Mythology",
  gothic: "Gothic",
  culture: "Culture",
};

const TAG_COLORS: Record<string, string> = {
  New: "#16a34a",
  Bestseller: "#ca8a04",
  Limited: "#7c3aed",
  Sale: "#b91c1c",
};

const emptyProduct = (): Partial<Product> => ({
  id: `prod-${Math.random().toString(36).substr(2, 6)}`,
  name: "",
  collection: "mythology",
  category: "Rings",
  material: "Sterling Silver",
  materialDetail: "925 Silver",
  price: 0,
  originalPrice: undefined,
  image: "/assets/products/medusa_ring.jpg",
  description: "",
  tag: undefined,
  isFeatured: false,
});

// ─── Stat Card Component ───────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div style={{
      background: "white", border: "1px solid rgba(26,26,26,0.08)",
      padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem",
    }}>
      <div style={{ width: "44px", height: "44px", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.75rem", fontWeight: 600, color: "var(--color-ink)" }}>{value}</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-ink-muted)", letterSpacing: "0.05em" }}>{label}</p>
      </div>
    </div>
  );
}

// ─── Field Component ──────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)", marginBottom: "0.4rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.75rem", boxSizing: "border-box",
  border: "1px solid rgba(26,26,26,0.18)", background: "var(--color-ivory)",
  fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink)",
  outline: "none",
};

// ─── Edit Modal ────────────────────────────────────────────────
function EditModal({
  product, onSave, onCancel, saving
}: {
  product: Partial<Product>;
  onSave: (p: Product) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<Product>>(product);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const set = (key: keyof Product, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
        alert("Image upload failed. Please try again.");
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        set("image", downloadURL);
        setUploading(false);
        setUploadProgress(0);
      }
    );
  };

  const handleSave = () => {
    if (!form.name?.trim()) { alert("Product name is required."); return; }
    if (!form.price || form.price <= 0) { alert("Price must be greater than 0."); return; }
    onSave(form as Product);
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.5)", zIndex: 100 }} />

      {/* Modal Panel */}
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 101,
        width: "100%", maxWidth: "560px",
        background: "var(--color-ivory)", overflowY: "auto",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(26,26,26,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 300 }}>
            {product.id && !product.id.startsWith("prod-") ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-ink-muted)" }}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Image Preview */}
          {form.image && (
            <div style={{ width: "100%", height: "220px", overflow: "hidden", background: "var(--color-cream)", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {uploading && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(250,247,242,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <div style={{ width: "40%", height: "4px", background: "rgba(26,26,26,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${uploadProgress}%`, height: "100%", background: "var(--color-gold)", transition: "width 200ms" }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-ink)", fontWeight: 500 }}>Uploading... {Math.round(uploadProgress)}%</p>
                </div>
              )}
            </div>
          )}

          <Field label="Product Image">
            <div style={{ display: "flex", gap: "1rem" }}>
              <input 
                style={{ ...inputStyle, flex: 1, color: "var(--color-ink-muted)", cursor: "pointer" }} 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <input 
                style={{ ...inputStyle, flex: 1 }} 
                type="text" 
                value={form.image || ""} 
                onChange={e => set("image", e.target.value)} 
                placeholder="Or paste image URL" 
                disabled={uploading}
              />
            </div>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Product Name *">
              <input style={inputStyle} type="text" value={form.name || ""} onChange={e => set("name", e.target.value)} placeholder="e.g. Medusa Signet" />
            </Field>
            <Field label="Category">
              <select style={inputStyle} value={form.category || "Rings"} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Collection">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {COLLECTIONS.map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => set("collection", col)}
                  style={{
                    padding: "0.65rem",
                    border: `1.5px solid ${form.collection === col ? "var(--color-gold)" : "rgba(26,26,26,0.15)"}`,
                    background: form.collection === col ? "var(--color-gold)" : "transparent",
                    color: form.collection === col ? "var(--color-ink)" : "var(--color-ink-muted)",
                    fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.08em",
                    textTransform: "uppercase", cursor: "pointer", fontWeight: form.collection === col ? 600 : 400,
                    transition: "all 200ms",
                  }}
                >
                  {COLLECTION_LABELS[col]}
                </button>
              ))}
            </div>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Material">
              <select style={inputStyle} value={form.material || ""} onChange={e => set("material", e.target.value)}>
                {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Material Detail">
              <input style={inputStyle} type="text" value={form.materialDetail || ""} onChange={e => set("materialDetail", e.target.value)} placeholder="e.g. 925 Silver + Onyx" />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Price (₹) *">
              <input style={inputStyle} type="number" min={0} value={form.price || ""} onChange={e => set("price", Number(e.target.value))} placeholder="e.g. 12900" />
            </Field>
            <Field label="Original Price (₹) — if on Sale">
              <input style={inputStyle} type="number" min={0} value={form.originalPrice || ""} onChange={e => set("originalPrice", e.target.value ? Number(e.target.value) : undefined)} placeholder="Leave blank if none" />
            </Field>
          </div>

          <Field label="Tag / Badge">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
              {TAGS.map(tag => (
                <button
                  key={tag || "none"}
                  type="button"
                  onClick={() => set("tag", tag || undefined)}
                  style={{
                    padding: "0.5rem 0.25rem",
                    border: `1.5px solid ${form.tag === (tag || undefined) ? (TAG_COLORS[tag] || "var(--color-ink)") : "rgba(26,26,26,0.15)"}`,
                    background: form.tag === (tag || undefined) ? (TAG_COLORS[tag] || "var(--color-ink)") : "transparent",
                    color: form.tag === (tag || undefined) ? "white" : "var(--color-ink-muted)",
                    fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.06em",
                    textTransform: "uppercase", cursor: "pointer",
                    transition: "all 200ms",
                  }}
                >
                  {tag || "None"}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Description">
            <textarea
              style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
              value={form.description || ""}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe the product..."
            />
          </Field>

          {/* Toggles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {([
              { key: "isFeatured", label: "Featured Product", icon: <Star size={14} /> },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => set(key, !form[key])}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  border: `1.5px solid ${form[key] ? "var(--color-gold)" : "rgba(26,26,26,0.15)"}`,
                  background: form[key] ? "var(--color-gold)" : "transparent",
                  color: form[key] ? "var(--color-ink)" : "var(--color-ink-muted)",
                  fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.06em",
                  textTransform: "uppercase", cursor: "pointer",
                  transition: "all 200ms",
                }}
              >
                {icon} {label}: {form[key] ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid rgba(26,26,26,0.1)", display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, padding: "0.875rem", background: "var(--color-ink)", color: "white",
              border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.875rem",
              letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              opacity: saving ? 0.7 : 1, transition: "opacity 200ms",
            }}
          >
            <Save size={15} /> {saving ? "Saving..." : "Save Product"}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            style={{
              padding: "0.875rem 1.5rem", background: "transparent",
              border: "1px solid rgba(26,26,26,0.2)", cursor: "pointer",
              fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-ink-muted)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────
export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [filterCollection, setFilterCollection] = useState<string>("all");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const persistProducts = async (updated: Product[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProducts(updated);
        setEditing(null);
        setSuccessMsg("Changes saved successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert("Failed to save — please try again.");
      }
    } catch {
      alert("Network error. Please check the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = (updated: Product) => {
    const exists = products.some(p => p.id === updated.id);
    const newList = exists
      ? products.map(p => p.id === updated.id ? updated : p)
      : [updated, ...products];
    persistProducts(newList);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    persistProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = filterCollection === "all"
    ? products
    : products.filter(p => p.collection === filterCollection);

  const stats = {
    total: products.length,
    mythology: products.filter(p => p.collection === "mythology").length,
    gothic: products.filter(p => p.collection === "gothic").length,
    culture: products.filter(p => p.collection === "culture").length,
    onSale: products.filter(p => p.tag === "Sale").length,
    featured: products.filter(p => p.isFeatured).length,
  };

  return (
    <main style={{ background: "#f5f5f3", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ background: "var(--color-ink)", color: "white", padding: "0 2rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontFamily: "var(--font-sans)", fontSize: "0.8rem", transition: "color 200ms" }}>
              <ArrowLeft size={14} /> Home
            </Link>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 300, letterSpacing: "0.1em" }}>
              freyorajewel <span style={{ color: "var(--color-gold)", fontStyle: "italic" }}>Admin</span>
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {successMsg && (
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#4ade80", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                ✓ {successMsg}
              </span>
            )}
            <Link href="/" target="_blank" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: "var(--font-sans)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Eye size={14} /> View Live Site
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 2rem" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          <StatCard label="Total Products" value={stats.total} icon={<Package size={20} />} color="var(--color-ink)" />
          <StatCard label="Mythology" value={stats.mythology} icon={<LayoutGrid size={20} />} color="#C9A84C" />
          <StatCard label="Gothic" value={stats.gothic} icon={<LayoutGrid size={20} />} color="#3d3d3d" />
          <StatCard label="Culture" value={stats.culture} icon={<LayoutGrid size={20} />} color="#7c6a45" />
          <StatCard label="On Sale" value={stats.onSale} icon={<Tag size={20} />} color="#b91c1c" />
          <StatCard label="Featured" value={stats.featured} icon={<Star size={20} />} color="#ca8a04" />
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          {/* Collection Filter Tabs */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["all", ...COLLECTIONS] as string[]).map(col => (
              <button
                key={col}
                onClick={() => setFilterCollection(col)}
                style={{
                  padding: "0.5rem 1.25rem",
                  border: `1px solid ${filterCollection === col ? "var(--color-ink)" : "rgba(26,26,26,0.15)"}`,
                  background: filterCollection === col ? "var(--color-ink)" : "white",
                  color: filterCollection === col ? "white" : "var(--color-ink-muted)",
                  fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.08em",
                  textTransform: "capitalize", cursor: "pointer", transition: "all 200ms",
                }}
              >
                {col === "all" ? "All Products" : COLLECTION_LABELS[col]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setEditing(emptyProduct())}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "var(--color-gold)", color: "var(--color-ink)",
              border: "none", padding: "0.65rem 1.5rem",
              fontFamily: "var(--font-sans)", fontSize: "0.75rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", fontWeight: 600,
            }}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Product Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>Loading products...</div>
        ) : (
          <div style={{ background: "white", border: "1px solid rgba(26,26,26,0.08)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--color-cream)", borderBottom: "2px solid rgba(26,26,26,0.08)", textAlign: "left" }}>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)" }}>Product</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)" }}>Collection</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)" }}>Category</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)" }}>Price</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)" }}>Tag</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)" }}>Featured</th>
                  <th style={{ padding: "1rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "var(--color-ink-muted)" }}>
                      No products in this collection yet.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      style={{ borderBottom: "1px solid rgba(26,26,26,0.05)", transition: "background 150ms" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#fafaf9")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Product Name + Image */}
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                          <div style={{ width: "44px", height: "52px", flexShrink: 0, overflow: "hidden", background: "var(--color-cream)" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 500, color: "var(--color-ink)" }}>{product.name}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)", marginTop: "2px" }}>{product.materialDetail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Collection */}
                      <td style={{ padding: "0.875rem 1.25rem", textTransform: "capitalize", color: "var(--color-ink-muted)" }}>
                        {COLLECTION_LABELS[product.collection]}
                      </td>

                      {/* Category */}
                      <td style={{ padding: "0.875rem 1.25rem", color: "var(--color-ink-muted)" }}>{product.category}</td>

                      {/* Price */}
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <p style={{ fontWeight: 500 }}>₹{product.price.toLocaleString("en-IN")}</p>
                        {product.originalPrice && (
                          <p style={{ fontSize: "0.75rem", color: "var(--color-ink-muted)", textDecoration: "line-through", marginTop: "1px" }}>
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </p>
                        )}
                      </td>

                      {/* Tag */}
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        {product.tag ? (
                          <span style={{
                            display: "inline-block",
                            padding: "0.2rem 0.6rem",
                            background: TAG_COLORS[product.tag] || "#666",
                            color: "white",
                            fontSize: "0.65rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}>
                            {product.tag}
                          </span>
                        ) : (
                          <span style={{ color: "rgba(26,26,26,0.2)", fontSize: "0.75rem" }}>—</span>
                        )}
                      </td>

                      {/* Featured */}
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "0.25rem",
                          fontSize: "0.75rem",
                          color: product.isFeatured ? "#ca8a04" : "rgba(26,26,26,0.25)",
                          fontWeight: product.isFeatured ? 600 : 400,
                        }}>
                          <Star size={13} fill={product.isFeatured ? "#ca8a04" : "none"} />
                          {product.isFeatured ? "Yes" : "No"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "0.875rem 1.25rem", textAlign: "right" }}>
                        <button
                          onClick={() => setEditing(product)}
                          title="Edit"
                          style={{
                            background: "none", border: "1px solid rgba(26,26,26,0.15)",
                            color: "var(--color-ink-muted)", cursor: "pointer",
                            padding: "0.4rem 0.7rem", marginRight: "0.5rem",
                            transition: "all 200ms",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--color-ink)"; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-ink-muted)"; }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          title="Delete"
                          style={{
                            background: "none", border: "1px solid rgba(185,28,28,0.2)",
                            color: "#b91c1c", cursor: "pointer",
                            padding: "0.4rem 0.7rem",
                            transition: "all 200ms",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#b91c1c"; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#b91c1c"; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Table Footer */}
            <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid rgba(26,26,26,0.05)", background: "var(--color-cream)" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-ink-muted)" }}>
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {editing && (
        <EditModal
          product={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}
    </main>
  );
}
