import { useEffect, useState, useCallback } from "react";
import { ProductService } from "../services/ProductService";
import type { Product } from "../models/responses/Product";
import "../styles/ProductsPage.css";

interface CartItem extends Product {
  quantity: number;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar los productos"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(
      (item) => item.resourceId === product.resourceId
    );

    if (existingIndex >= 0) {
      cart[existingIndex] = {
        ...cart[existingIndex],
        quantity: cart[existingIndex].quantity + 1,
      };
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    notify(`${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div style={{ textAlign: "center", padding: 80, color: "var(--gray-400)" }}>
          <div className="spinner" />
          <p style={{ marginTop: 16 }}>Cargando productos…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--danger)", background: "var(--danger-bg)", borderColor: "var(--danger)" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {notification && <div className="notification">{notification}</div>}

      <header className="products-header">
        <h1>Nuestros Productos</h1>
        <p>{products.length} producto{products.length !== 1 ? "s" : ""} disponibles</p>
      </header>

      {products.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <p style={{ color: "var(--gray-400)" }}>No hay productos disponibles en este momento</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.resourceId} className="product-card card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
