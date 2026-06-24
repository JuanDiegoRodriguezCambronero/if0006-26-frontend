import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { ShoppingCart } from "./components/ShoppingCart";
import { AdminProducts } from "./components/AdminProducts";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <NavLink to="/" className="nav-logo">
              Shop<span>Hub</span>
            </NavLink>
            <ul className="nav-menu">
              <li>
                <NavLink to="/" end className="nav-link">
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/productos" className="nav-link">
                  Productos
                </NavLink>
              </li>
              <li>
                <NavLink to="/carrito" className="nav-link">
                  Carrito
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin" className="nav-link">
                  Admin
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/carrito" element={<ShoppingCart />} />
            <Route path="/admin" element={<AdminProducts />} />
          </Routes>
        </div>

        <footer className="footer">
          <p>&copy; 2026 ShopHub. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
