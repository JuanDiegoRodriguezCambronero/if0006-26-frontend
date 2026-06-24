import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleAddToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(
      (item) => item.resourceid === product.resourceid
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
    setNotification(`${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {notification && (
        <div className="notification">{notification}</div>
      )}

      <header className="products-header">
        <h1>Nuestros Productos</h1>
        <p>Selecciona los productos que deseas comprar</p>
      </header>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No hay productos disponibles en este momento</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.resourceid} className="product-card">
              <div className="product-image">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">
                  {product.description}
                </p>
                <div className="product-footer">
                  <span className="product-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="btn btn-add-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar al Carrito
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
