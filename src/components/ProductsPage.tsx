import { useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";
import type { Product } from "../models/responses/Product";
import "../styles/ProductsPage.css";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Lógica para agregar al carrito
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(
      (item: Product) => item.resourceid === product.resourceid
    );

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} agregado al carrito`);
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
