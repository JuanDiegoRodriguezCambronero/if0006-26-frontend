import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../models/responses/Product";
import "../styles/ShoppingCart.css";

interface CartItem extends Product {
  quantity: number;
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const CART_KEY = "cart";
const SAVED_KEY = "savedItems";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(CART_KEY, [])
  );
  const [savedItems, setSavedItems] = useState<Product[]>(() =>
    loadFromStorage<Product[]>(SAVED_KEY, [])
  );
  const [notification, setNotification] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const cartQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem(SAVED_KEY, JSON.stringify(savedItems)); }, [savedItems]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) { removeItem(productId); return; }
    setCartItems((current) =>
      current.map((item) =>
        item.resourceId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((current) => current.filter((item) => item.resourceId !== productId));
  };

  const saveForLater = (productId: string) => {
    const item = cartItems.find((entry) => entry.resourceId === productId);
    if (!item) return;
    setCartItems((current) => current.filter((entry) => entry.resourceId !== productId));
    setSavedItems((current) => {
      if (current.some((entry) => entry.resourceId === productId)) return current;
      return [...current, { resourceId: item.resourceId, name: item.name, description: item.description, price: item.price, image: item.image }];
    });
    notify(`${item.name} guardado para después`);
  };

  const moveToCart = (productId: string) => {
    const item = savedItems.find((entry) => entry.resourceId === productId);
    if (!item) return;
    setCartItems((current) => [...current, { ...item, quantity: 1 }]);
    setSavedItems((current) => current.filter((entry) => entry.resourceId !== productId));
  };

  const clearCart = () => setCartItems([]);

  const checkout = () => {
    if (cartItems.length === 0) { notify("El carrito está vacío"); return; }
    notify(`Pedido realizado por ${currencyFormatter.format(total)}`);
    setCartItems([]);
  };

  const empty = cartItems.length === 0 && savedItems.length === 0;

  return (
    <div className="cart-page">
      {notification && <div className="notification">{notification}</div>}

      <header className="cart-header">
        <h1>Carrito de Compras</h1>
        {!empty && <p>{cartQuantity} artículo{cartQuantity !== 1 ? "s" : ""} en tu carrito</p>}
      </header>

      {empty ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: "var(--gray-300)" }}>🛒</div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Tu carrito está vacío</h2>
          <p style={{ color: "var(--gray-400)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Agrega productos desde nuestra tienda y vuelve aquí para pagar.
          </p>
          <Link to="/productos" className="btn btn-primary">
            Ir a Productos
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-main">
            {cartItems.length > 0 && (
              <section className="cart-section card">
                <h2>Artículos en tu carrito</h2>
                {cartItems.map((item) => (
                  <div key={item.resourceId} className="cart-row">
                    <div className="cart-row-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span>{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="cart-row-details">
                      <h3>{item.name}</h3>
                      <p className="cart-row-price">{currencyFormatter.format(item.price)}</p>
                    </div>
                    <div className="cart-row-qty">
                      <button className="qty-btn" onClick={() => updateQuantity(item.resourceId, item.quantity - 1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.resourceId, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-row-total">
                      <span>{currencyFormatter.format(item.price * item.quantity)}</span>
                      <div className="cart-row-actions">
                        <button className="link-btn" onClick={() => saveForLater(item.resourceId)}>Guardar</button>
                        <button className="link-btn link-btn-danger" onClick={() => removeItem(item.resourceId)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {savedItems.length > 0 && (
              <section className="cart-section card">
                <h2>Guardados para después</h2>
                {savedItems.map((item) => (
                  <div key={item.resourceId} className="cart-row cart-row-saved">
                    <div className="cart-row-image cart-row-image-sm">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <span>{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="cart-row-details">
                      <h3>{item.name}</h3>
                      <p className="cart-row-price">{currencyFormatter.format(item.price)}</p>
                    </div>
                    <button className="btn btn-sm btn-secondary" onClick={() => moveToCart(item.resourceId)}>
                      Mover al carrito
                    </button>
                  </div>
                ))}
              </section>
            )}
          </div>

          <aside className="cart-sidebar">
            <div className="cart-summary card">
              <h2>Resumen</h2>
              <div className="summary-line">
                <span>Subtotal ({cartQuantity} artículo{cartQuantity !== 1 ? "s" : ""})</span>
                <span>{currencyFormatter.format(subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Envío</span>
                <span>{shipping > 0 ? currencyFormatter.format(shipping) : "Gratis"}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>{currencyFormatter.format(total)}</span>
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 20 }} onClick={checkout} disabled={cartItems.length === 0}>
                Proceder al Pago
              </button>
              <button className="btn btn-secondary" style={{ width: "100%", marginTop: 8 }} onClick={clearCart}>
                Vaciar Carrito
              </button>
              <Link to="/productos" className="btn btn-ghost" style={{ width: "100%", marginTop: 8, textDecoration: "none", textAlign: "center" }}>
                ← Seguir comprando
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
