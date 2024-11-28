import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../Services/firebaseCofig";
import './Dashboard.css';

const Dashboard = () => {
  const [totalProductos, setTotalProductos] = useState(0);
  const [entradasHoy, setEntradasHoy] = useState(0);
  const [salidasHoy, setSalidasHoy] = useState(0);
  const [productosBajosStock, setProductosBajosStock] = useState(0);

  useEffect(() => {
    const fetchTotalProductos = async () => {
      try {
        const productosSnapshot = await getDocs(collection(db, "Productos"));
        setTotalProductos(productosSnapshot.size);

        const productosBajos = productosSnapshot.docs.filter(
          doc => doc.data().stock < 10
        );
        setProductosBajosStock(productosBajos.length);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    const obtenerFechaLocal = () => {
      const hoy = new Date();
      const anio = hoy.getFullYear();
      const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
      const dia = String(hoy.getDate()).padStart(2, '0');
      return `${anio}-${mes}-${dia}`;
    };

    const fetchMovimientosHoy = async () => {
      try {
        const todayString = obtenerFechaLocal();
        console.log("Fecha de hoy:", todayString);

        const movimientosSnapshot = await getDocs(collection(db, "Movimientos"));
        
        // Filtrar y contar movimientos
        let entradas = 0;
        let salidas = 0;

        movimientosSnapshot.docs.forEach(doc => {
          const data = doc.data();
          
          if (data.fecha === todayString) {
            if (data.tipo === "Entrada") {
              entradas++;
            } else if (data.tipo === "Salida") {
              salidas++;
            }
          }
        });

     
        setEntradasHoy(entradas);
        setSalidasHoy(salidas);

        
        console.log({
          fechaBuscada: todayString,
          totalMovimientos: movimientosSnapshot.size,
          entradasContadas: entradas,
          salidasContadas: salidas
        });

      } catch (error) {
        console.error("Error al obtener movimientos:", error);
      }
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