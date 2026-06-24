import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const notify = (message: string) => setNotification(message);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems((current) =>
      current.map((item) =>
        item.resourceid === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCartItems((current) => current.filter((item) => item.resourceid !== productId));
  };

  const saveForLater = (productId: number) => {
    const item = cartItems.find((entry) => entry.resourceid === productId);
    if (!item) return;
    setCartItems((current) => current.filter((entry) => entry.resourceid !== productId));
    setSavedItems((current) => {
      if (current.some((entry) => entry.resourceid === productId)) return current;
      return [...current, { resourceid: item.resourceid, name: item.name, description: item.description, price: item.price, image: item.image }];
    });
    notify(`${item.name} guardado para después`);
  };

  const moveToCart = (productId: number) => {
    const item = savedItems.find((entry) => entry.resourceid === productId);
    if (!item) return;
    setCartItems((current) => [...current, { ...item, quantity: 1 }]);
    setSavedItems((current) => current.filter((entry) => entry.resourceid !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      notify("El carrito está vacío");
      return;
    }
    notify(`Pedido realizado por ${currencyFormatter.format(total)}`);
    setCartItems([]);
  };

  return (
    <div className="shopping-cart">
      {notification && (
        <div className="notification">{notification}</div>
      )}

      <header className="cart-header">
        <h1>Mi Carrito de Compras</h1>
        <p>
          {cartQuantity} artículo{cartQuantity !== 1 ? "s" : ""} en el carrito
        </p>
      </header>

      {cartItems.length === 0 && savedItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Comienza a agregar productos desde nuestra tienda</p>
          <Link to="/productos" className="btn btn-primary">
            Ir a Productos
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-main">
            {cartItems.length > 0 && (
              <section className="cart-section">
                <h2>Artículos en tu carrito</h2>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.resourceid} className="cart-item">
                      <div className="item-image">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                        />
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-price">{currencyFormatter.format(item.price)}</p>
                      </div>
                      <div className="item-quantity">
                        <button onClick={() => updateQuantity(item.resourceid, item.quantity - 1)}>-</button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.resourceid, parseInt(e.target.value) || 1)}
                        />
                        <button onClick={() => updateQuantity(item.resourceid, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-subtotal">
                        <span>{currencyFormatter.format(item.price * item.quantity)}</span>
                        <div className="item-actions">
                          <button className="btn-save" onClick={() => saveForLater(item.resourceid)}>
                            Guardar
                          </button>
                          <button className="btn-remove" onClick={() => removeItem(item.resourceid)}>
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {savedItems.length > 0 && (
              <section className="cart-section">
                <h2>Guardados para después</h2>
                <div className="saved-items">
                  {savedItems.map((item) => (
                    <div key={item.resourceid} className="saved-item">
                      <div className="saved-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>{item.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="saved-item-details">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p className="item-price">{currencyFormatter.format(item.price)}</p>
                      </div>
                      <button className="btn-move-to-cart" onClick={() => moveToCart(item.resourceid)}>
                        Mover al carrito
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="cart-summary">
            <h2>Resumen del pedido</h2>
            <div className="summary-row">
              <span>Subtotal ({cartQuantity} artículo{cartQuantity !== 1 ? "s" : ""})</span>
              <span>{currencyFormatter.format(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{shipping > 0 ? currencyFormatter.format(shipping) : "Gratis"}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{currencyFormatter.format(total)}</span>
            </div>
            <button className="btn btn-checkout" onClick={checkout} disabled={cartItems.length === 0}>
              Proceder al Pago
            </button>
            <button className="btn btn-secondary" onClick={clearCart}>
              Vaciar Carrito
            </button>
            <Link to="/productos" className="btn btn-link">
              Continuar Comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
