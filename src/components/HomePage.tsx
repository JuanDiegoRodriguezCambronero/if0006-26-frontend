import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const features = [
  {
    icon: "★",
    title: "Productos Premium",
    desc: "Catálogo completo de productos de alta calidad seleccionados para ti",
    link: "/productos",
    label: "Ver Productos",
    variant: "primary",
  },
  {
    icon: "◆",
    title: "Carrito Inteligente",
    desc: "Gestiona tus compras de forma fácil, rápida y con entrega garantizada",
    link: "/carrito",
    label: "Mi Carrito",
    variant: "secondary",
  },
  {
    icon: "●",
    title: "Ofertas Exclusivas",
    desc: "Descuentos especiales y promociones que no encontrarás en otro lugar",
    link: "/productos",
    label: "Explorar",
    variant: "primary",
  },
];

const benefits = [
  "Envío rápido a todo el país",
  "Garantía de satisfacción total",
  "Soporte al cliente 24/7",
  "Precios competitivos y justos",
];

export function HomePage() {
  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-badge">Nueva Colección 2026</div>
        <h1 className="hero-title">
          Descubre productos que <span className="hero-highlight">inspiran</span>
        </h1>
        <p className="hero-sub">
          Calidad, confianza y el mejor precio en un solo lugar.
        </p>
        <Link to="/productos" className="btn btn-primary btn-lg hero-cta">
          Comprar Ahora
        </Link>
      </header>

      <section className="features-grid">
        {features.map((f) => (
          <div key={f.title} className="feature-card card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <Link to={f.link} className={`btn btn-${f.variant} btn-sm`}>
              {f.label} →
            </Link>
          </div>
        ))}
      </section>

      <section className="benefits">
        <h2>¿Por qué elegirnos?</h2>
        <div className="benefits-list">
          {benefits.map((b) => (
            <div key={b} className="benefit-item">
              <span className="benefit-check">✓</span>
              {b}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
