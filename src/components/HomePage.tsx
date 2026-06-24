import { Link } from "react-router-dom";
import "../styles/HomePage.css";

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Bienvenido a Nuestra Tienda</h1>
        <p>Encuentra los mejores productos con nosotros</p>
      </header>

      <section className="home-features">
        <div className="feature-card">
          <h3>Productos Premium</h3>
          <p>Accede a nuestro catálogo completo de productos de alta calidad</p>
          <Link to="/productos" className="btn btn-primary">
            Ver Productos
          </Link>
        </div>

        <div className="feature-card">
          <h3>Carrito de Compras</h3>
          <p>Gestiona tus productos seleccionados de forma fácil y rápida</p>
          <Link to="/carrito" className="btn btn-secondary">
            Mi Carrito
          </Link>
        </div>

        <div className="feature-card">
          <h3>Ofertas Especiales</h3>
          <p>No te pierdas nuestras promociones exclusivas y descuentos</p>
          <Link to="/productos" className="btn btn-primary">
            Explorar Ofertas
          </Link>
        </div>
      </section>

      <section className="home-info">
        <h2>¿Por qué elegirnos?</h2>
        <ul>
          <li>Envío rápido a todo el país</li>
          <li>Garantía de satisfacción del cliente</li>
          <li>Soporte al cliente 24/7</li>
          <li>Precios competitivos y justos</li>
        </ul>
      </section>
    </div>
  );
}
