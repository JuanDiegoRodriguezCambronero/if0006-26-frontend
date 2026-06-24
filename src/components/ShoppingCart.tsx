import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../models/responses/Product";
import "../styles/ShoppingCart.css";

interface CartItem extends Product {
  quantity: number;
}

export function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  const calculateTotal = () => {
    const sum = cartItems.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    setTotal(sum);
  };

  const updateQuantity = (productId: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string | number) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const checkout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    alert(`Pedido realizado por un total de $${total.toFixed(2)}`);
    clearCart();
  };

  return (
    <div className="shopping-cart">
      <header className="cart-header">
        <h1>Mi Carrito de Compras</h1>
        <p>
          {cartItems.length} producto{cartItems.length !== 1 ? "s" : ""} en el
          carrito
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Comienza a agregar productos desde nuestra tienda</p>
          <Link to="/productos" className="btn btn-primary">
            Ir a Productos
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, (item.quantity || 1) - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                  />
                  <button
                    onClick={() =>
                      updateQuantity(item.id, (item.quantity || 1) + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  <button
                    className="btn-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-checkout" onClick={checkout}>
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
