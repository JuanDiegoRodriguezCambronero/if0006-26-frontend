import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ShoppingCart } from "./components/ShoppingCart";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🛍️ Mi Tienda
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/productos" className="nav-link">
                  Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/carrito" className="nav-link cart-link">
                  🛒 Carrito
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/carrito" element={<ShoppingCart />} />
        </Routes>

        <footer className="footer">
          <p>&copy; 2024 Mi Tienda. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;