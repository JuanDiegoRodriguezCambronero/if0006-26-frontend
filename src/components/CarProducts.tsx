import { useEffect, useMemo, useState } from "react";
import type { Product } from "../models/responses/Product";

// CORRECCIÓN: Importamos el servicio unificado correctamente
import { ProductService } from "../services/ProductService";

type CartItem = Product & { quantity: number };

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function CarProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // CORRECCIÓN: Llamada mediante el objeto unificado
    ProductService.getProducts()
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos. Intenta de nuevo más tarde.");
        setLoading(false);
      });
  }, []);

  const cartQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.resourceid === product.resourceid);
      if (existing) {
        return current.map((item) =>
          item.resourceid === product.resourceid
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setSavedItems((current) => current.filter((item) => item.resourceid !== product.resourceid));
  };

  // CORRECCIÓN: Tipado de resourceid ajustado a string | number
  const updateQuantity = (resourceid: string | number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      removeFromCart(resourceid);
      return;
    }
    setCartItems((current) =>
      current.map((item) =>
        item.resourceid === resourceid ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  };

  // CORRECCIÓN: Tipado de resourceid ajustado a string | number
  const removeFromCart = (resourceid: string | number) => {
    setCartItems((current) => current.filter((item) => item.resourceid !== resourceid));
  };

  // CORRECCIÓN: Tipado de resourceid ajustado a string | number
  const saveForLater = (resourceid: string | number) => {
    const item = cartItems.find((entry) => entry.resourceid === resourceid);
    if (!item) return;

    setCartItems((current) => current.filter((entry) => entry.resourceid !== resourceid));
    setSavedItems((current) => {
      if (current.some((entry) => entry.resourceid === resourceid)) {
        return current;
      }
      return [...current, { resourceid: item.resourceid, name: item.name, description: item.description, price: item.price }];
    });
  };

  // CORRECCIÓN: Tipado de resourceid ajustado a string | number
  const moveToCart = (resourceid: string | number) => {
    const item = savedItems.find((entry) => entry.resourceid === resourceid);
    if (!item) return;
    addToCart(item);
    setSavedItems((current) => current.filter((entry) => entry.resourceid !== resourceid));
  };

  return (
    <div className="amazon-cart">
      <div className="amazon-cart__header">
        <div>
          <h1>Carrito de compras</h1>
          <p className="amazon-cart__subtitle">
            {cartItems.length > 0
              ? `${cartQuantity} artículo${cartQuantity === 1 ? "" : "s"} en tu carrito`
              : "Tu carrito está vacío. Agrega productos disponibles más abajo."}
          </p>
        </div>
        <div className="amazon-cart__top-summary">
          <span>Resumen del pedido</span>
          <strong>{currencyFormatter.format(total)}</strong>
          <span>{cartItems.length} artículo{cartItems.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      {error && <div className="amazon-cart__status amazon-cart__status--error">{error}</div>}

      <div className="amazon-cart__content">
        <main className="amazon-cart__main">
          <section className="amazon-cart__panel">
            <div className="amazon-cart__panel-header">
              <h2>Artículos en el carrito</h2>
            </div>
            {cartItems.length === 0 ? (
              <p className="amazon-cart__empty">No hay artículos en el carrito por el momento.</p>
            ) : (
              <div className="amazon-cart__cart-list">
                {cartItems.map((item) => (
                  <article className="amazon-cart__cart-item" key={item.resourceid}>
                    <div className="amazon-cart__cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        item.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="amazon-cart__cart-item-body">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <div className="amazon-cart__cart-item-actions">
                          <button
                            type="button"
                            className="amazon-cart__link-button"
                            onClick={() => updateQuantity(item.resourceid, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span>Cantidad: {item.quantity}</span>
                          <button
                            type="button"
                            className="amazon-cart__link-button"
                            onClick={() => updateQuantity(item.resourceid, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="amazon-cart__link-button"
                            onClick={() => saveForLater(item.resourceid)}
                          >
                            Guardar para después
                          </button>
                          <button
                            type="button"
                            className="amazon-cart__link-button"
                            onClick={() => removeFromCart(item.resourceid)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="amazon-cart__cart-item-price">
                      {currencyFormatter.format(item.price * item.quantity)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="amazon-cart__panel amazon-cart__panel--saved">
            <div className="amazon-cart__panel-header">
              <h2>Guardados para más tarde</h2>
            </div>
            {savedItems.length === 0 ? (
              <p className="amazon-cart__empty">No hay artículos guardados para más tarde.</p>
            ) : (
              <div className="amazon-cart__saved-list">
                {savedItems.map((item) => (
                  <article className="amazon-cart__saved-item" key={item.resourceid}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="amazon-cart__link-button"
                        onClick={() => moveToCart(item.resourceid)}
                      >
                        Mover al carrito
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="amazon-cart__panel">
            <div className="amazon-cart__panel-header">
              <h2>Productos disponibles</h2>
            </div>
            {loading ? (
              <p className="amazon-cart__empty">Cargando productos…</p>
            ) : (
              <div className="amazon-cart__product-list">
                {products.map((product) => (
                  <article className="amazon-cart__product-card" key={product.resourceid}>
                    <div className="amazon-cart__product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        product.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="amazon-cart__product-details">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="amazon-cart__product-meta">
                        <strong>{currencyFormatter.format(product.price)}</strong>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="amazon-cart__button amazon-cart__button--primary"
                        onClick={() => addToCart(product)}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="amazon-cart__aside">
          <div className="amazon-cart__summary-box">
            <h2>Resumen del pedido</h2>
            <div className="amazon-cart__summary-row">
              <span>Subtotal ({cartQuantity} artículo{cartQuantity === 1 ? "" : "s"})</span>
              <strong>{currencyFormatter.format(subtotal)}</strong>
            </div>
            <div className="amazon-cart__summary-row">
              <span>Envío</span>
              <strong>{shipping > 0 ? currencyFormatter.format(shipping) : "Gratis"}</strong>
            </div>
            <div className="amazon-cart__summary-row amazon-cart__summary-row--total">
              <span>Total</span>
              <strong>{currencyFormatter.format(total)}</strong>
            </div>
            <button
              type="button"
              className="amazon-cart__button amazon-cart__button--checkout"
              disabled={cartItems.length === 0}
            >
              Proceder al pago
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}