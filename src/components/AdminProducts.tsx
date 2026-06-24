import { useEffect, useState, useCallback, startTransition } from "react";
import { ProductService } from "../services/ProductService";
import type { Product } from "../models/responses/Product";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  image: string;
}

const emptyForm: ProductForm = { name: "", description: "", price: "", image: "" };

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => { refreshProducts(); });
  }, [refreshProducts]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.resourceId);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.price) {
      notify("Completa todos los campos requeridos");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      notify("El precio debe ser un número válido");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        image: form.image.trim() || undefined,
      };
      if (editingId) {
        await ProductService.updateProduct(editingId, payload);
        notify("Producto actualizado correctamente");
      } else {
        await ProductService.createProduct(payload);
        notify("Producto creado correctamente");
      }
      setShowModal(false);
      await refreshProducts();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await ProductService.deleteProduct(deletingId);
      notify("Producto eliminado correctamente");
      setDeletingId(null);
      await refreshProducts();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Error al eliminar");
      setDeletingId(null);
    }
  };

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Administrar Productos</h1>
          <p style={{ margin: "4px 0 0", color: "var(--gray-400)", fontSize: 14 }}>
            {products.length} producto{products.length !== 1 ? "s" : ""} registrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Nuevo Producto
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--gray-400)" }}>
          Cargando productos…
        </div>
      )}

      {error && (
        <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--danger)", background: "var(--danger-bg)", borderColor: "var(--danger)" }}>
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <p style={{ color: "var(--gray-400)", marginBottom: 16 }}>No hay productos registrados</p>
          <button className="btn btn-primary" onClick={openCreate}>Crear primer producto</button>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", color: "var(--gray-400)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Producto</th>
                <th style={{ padding: "12px 16px", color: "var(--gray-400)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Descripción</th>
                <th style={{ padding: "12px 16px", color: "var(--gray-400)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Precio</th>
                <th style={{ padding: "12px 16px", color: "var(--gray-400)", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", width: 140 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.resourceId} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--gray-50)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--gray-800)" }}>{product.name}</td>
                  <td style={{ padding: "14px 16px", color: "var(--gray-500)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.description}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 700, color: "var(--primary)" }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(product)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeletingId(product.resourceId)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.25rem" }}>{editingId ? "Editar Producto" : "Nuevo Producto"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", fontSize: 20, padding: 4 }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 6 }}>Nombre *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre del producto"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 6 }}>Descripción *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descripción del producto"
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 6 }}>Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 6 }}>URL de imagen</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando…" : editingId ? "Actualizar" : "Crear Producto"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 32, maxWidth: 400 }}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: 8 }}>Eliminar Producto</h2>
            <p style={{ color: "var(--gray-500)", fontSize: 14, marginBottom: 24 }}>
              ¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setDeletingId(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
