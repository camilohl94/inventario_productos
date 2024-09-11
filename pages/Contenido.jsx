import Header from "./Header";
import Dashboard from "./Dashboard";
import Registros from "./Registros";
import Inventario from "./Inventario";
import Reportes from "./Reportes";
const Contenido = ({ activeSection }) => {
  return (
    <div className="main-content">
      <Header />
      {activeSection === "Dashboard" && <Dashboard />}
      {activeSection === "Register" && <Registros />}
      {activeSection === "Inventory" && <Inventario />}
      {activeSection === "Reports" && <Reportes />}
    </div>
  );
};

export default Contenido;
