const Sidebar = ({ onSectionChange }) => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Inventario </h2>
      </div>
      <ul className="nav-links">
        <li onClick={() => onSectionChange("Dashboard")} className="nav-item">
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </li>
        <li onClick={() => onSectionChange("Register")} className="nav-item">
          <i className="fas fa-box"></i>
          <span>Registrar Producto</span>
        </li>
        <li onClick={() => onSectionChange("Inventory")} className="nav-item">
          <i className="fas fa-exchange-alt"></i>
          <span>Entradas/Salidas</span>
        </li>
        <li onClick={() => onSectionChange("Reports")} className="nav-item">
          <i className="fas fa-chart-line"></i>
          <span>Reportes</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <p>&copy; 2024 Trabajo Integrador</p>
      </div>
    </nav>
  );
};
export default Sidebar;

