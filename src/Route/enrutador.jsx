import { createBrowserRouter,Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Registros from "../pages/Registros/Registros";
import Inventario from "../pages/Inventario/Inventario";
import Reportes from "../pages/Reportes/Reportes";
import App from "../pages/App/App";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute"

export const enrutadorApp = createBrowserRouter([

  {
    path:"/Login",
    element:<Login/>
  },
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute> ,  
    children: [
      {
        path: "Dashboard",
        element: <Dashboard />,  
      },
      {
        path: "Registros",
        element: <Registros />,
      },
      {
        path: "Inventario",
        element: <Inventario />,
      },
      {
        path: "Reportes",
        element: <Reportes />,
      },
      {
        path:"/",
        element:<Navigate to="/Dashboard" replace/>
      },
    ],
  },
]);