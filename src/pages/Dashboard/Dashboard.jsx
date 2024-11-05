import React, { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../Services/firebaseCofig";
import './Dashboard.css';

const Dashboard = () => {
  const [totalProductos, setTotalProductos] = useState(0);
  const [entradasHoy, setEntradasHoy] = useState(0);
  const [salidasHoy, setSalidasHoy] = useState(0);
  const [productosBajosStock, setProductosBajosStock] = useState(0);

  useEffect(() => {
    // Obtener total de productos
    const fetchTotalProductos = async () => {
      const productosSnapshot = await getDocs(collection(db, "Productos"));
      setTotalProductos(productosSnapshot.size);
      
      // Calcular productos bajos en stock (ej. menos de 10 unidades)
      const productosBajos = productosSnapshot.docs.filter(doc => doc.data().stock < 10);
      setProductosBajosStock(productosBajos.length);
    };

    // Obtener entradas y salidas de hoy
    const fetchMovimientosHoy = async () => {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const movimientosSnapshot = await getDocs(
        query(collection(db, "Movimientos"), where("fecha", ">=", startOfDay))
      );

      // Calcular entradas y salidas
      const entradas = movimientosSnapshot.docs.filter(doc => doc.data().tipo === "entrada");
      const salidas = movimientosSnapshot.docs.filter(doc => doc.data().tipo === "salida");

      setEntradasHoy(entradas.length);
      setSalidasHoy(salidas.length);
    };

    fetchTotalProductos();
    fetchMovimientosHoy();
  }, []);

  return (
    <section id="dashboard" className="dashboard">
      <div className="cards">
        <div className="card-1">
          <div className="card-info">
            <h3>Total de Productos</h3>
            <p>{totalProductos}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-boxes"></i>
          </div>
        </div>
        <div className="card-2">
          <div className="card-info">
            <h3>Entradas Hoy</h3>
            <p>{entradasHoy}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-arrow-down"></i>
          </div>
        </div>
        <div className="card-3">
          <div className="card-info">
            <h3>Salidas Hoy</h3>
            <p>{salidasHoy}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-arrow-up"></i>
          </div>
        </div>
        <div className="card-4">
          <div className="card-info">
            <h3>Productos Bajos en Stock</h3>
            <p>{productosBajosStock}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
