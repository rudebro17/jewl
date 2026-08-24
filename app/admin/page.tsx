"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import type { Product } from "../../data/products";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (updatedProducts: Product[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProducts),
      });
      if (res.ok) {
        setProducts(updatedProducts);
        setEditingId(null);
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveEdit = () => {
    if (!formData.id || !formData.name) return;
    
    let newProducts;
    if (editingId === "new") {
      newProducts = [formData as Product, ...products];
    } else {
      newProducts = products.map((p) => (p.id === editingId ? (formData as Product) : p));
    }
    
    handleSaveAll(newProducts);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const newProducts = products.filter((p) => p.id !== id);
      handleSaveAll(newProducts);
    }
  };

  const startAdd = () => {
    setEditingId("new");
    setFormData({
      id: `prod-${Math.random().toString(36).substr(2, 5)}`,
      name: "",
      collection: "mythology",
      category: "Rings",
      material: "Sterling Silver",
      materialDetail: "925 Silver",
      price: 0,
      image: "/assets/products/placeholder.jpg",
      description: "",
      isFeatured: false,
    });
  };

  return (
    <main style={{ background: "var(--color-ivory)", minHeight: "100vh", padding: "4rem 0" }}>
      <div className="container-editorial">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3rem" }}>
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-ink-muted)", textDecoration: "none", fontFamily: "var(--font-sans)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 300, color: "var(--color-ink)" }}>
              Admin Dashboard
            </h1>
          </div>
          <button onClick={startAdd} className="btn-primary" style={{ display: "flex", gap: "0.5rem" }} disabled={editingId !== null}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        {loading ? (
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink-muted)" }}>Loading products...</p>
        ) : (
          <div style={{ background: "white", border: "1px solid rgba(26,26,26,0.1)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ background: "var(--color-cream)", borderBottom: "1px solid rgba(26,26,26,0.1)", textAlign: "left" }}>
                  <th style={{ padding: "1rem" }}>Image</th>
                  <th style={{ padding: "1rem" }}>Name</th>
                  <th style={{ padding: "1rem" }}>Collection</th>
                  <th style={{ padding: "1rem" }}>Price (₹)</th>
                  <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Add/Edit Form Row */}
                {editingId && (
                  <tr style={{ background: "var(--color-parchment)", borderBottom: "1px solid rgba(26,26,26,0.1)" }}>
                    <td style={{ padding: "1rem" }}>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={formData.image || ""}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        style={{ width: "100%", padding: "0.5rem", border: "1px solid rgba(26,26,26,0.2)" }}
                      />
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: "100%", padding: "0.5rem", border: "1px solid rgba(26,26,26,0.2)" }}
                      />
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <select
                        value={formData.collection || "mythology"}
                        onChange={(e) => setFormData({ ...formData, collection: e.target.value as any })}
                        style={{ width: "100%", padding: "0.5rem", border: "1px solid rgba(26,26,26,0.2)" }}
                      >
                        <option value="mythology">Mythology</option>
                        <option value="gothic">Gothic</option>
                        <option value="culture">Culture</option>
                      </select>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <input
                        type="number"
                        placeholder="Price"
                        value={formData.price || 0}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        style={{ width: "100px", padding: "0.5rem", border: "1px solid rgba(26,26,26,0.2)" }}
                      />
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <button onClick={saveEdit} disabled={saving} style={{ background: "var(--color-ink)", color: "white", border: "none", padding: "0.5rem 1rem", cursor: "pointer", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <Save size={14} /> {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={cancelEdit} disabled={saving} style={{ background: "transparent", border: "1px solid var(--color-ink)", padding: "0.5rem 1rem", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                )}

                {/* Product List */}
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid rgba(26,26,26,0.05)", opacity: editingId && editingId !== product.id && editingId !== "new" ? 0.4 : 1 }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ width: "40px", height: "50px", background: "#eee", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 500 }}>{product.name}</td>
                    <td style={{ padding: "1rem", textTransform: "capitalize" }}>{product.collection}</td>
                    <td style={{ padding: "1rem" }}>₹{product.price.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <button
                        onClick={() => startEdit(product)}
                        disabled={editingId !== null}
                        style={{ background: "none", border: "none", color: "var(--color-ink-muted)", cursor: "pointer", padding: "0.5rem", marginRight: "0.5rem" }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={editingId !== null}
                        style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", padding: "0.5rem" }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
