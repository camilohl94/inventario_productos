import { Link, useNavigate} from "react-router-dom";
import './Sidebar.css'

const Sidebar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  const handleLogout = ()=>{
    localStorage.removeItem("authToken");
    navigate("/Login");

  }
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
         <h2>Inventario</h2>
         <img src="/new_logo.jpeg" alt="logo_sidebar"  className="logo" />
      </div>
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="Dashboard">
            <i className="fas fa-home"></i>
            <span> Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="Registros">
            <i className="fas fa-box"></i>
            <span>Registrar Producto</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="Inventario">
            <i className="fas fa-exchange-alt"></i>
            <span>Entradas/Salidas</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="Reportes">
            <i className="fas fa-chart-line"></i>
            <span>Reportes</span>
          </Link>
        </li>
        <li className="nav-item" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Salir</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <p>&copy; 2024 Trabajo Integrador</p>
      </div>
    </nav>
  );
};

export default Sidebar;


