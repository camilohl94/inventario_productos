import React, { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../Services/firebaseCofig";
import './Reportes.css';

const Reportes = () => {
  const [reporteTipo, setReporteTipo] = useState('');
  const [resultadoReporte, setResultadoReporte] = useState([]);
  const [error, setError] = useState('');

  // Obtener el reporte según el tipo seleccionado
  const generarReporte = async (e) => {
    e.preventDefault();
    setError('');
    setResultadoReporte([]);

    try {
      switch (reporteTipo) {
        case 'bajo-stock':
          await obtenerProductosBajoStock();
          break;
        case 'movimientos':
          await obtenerMovimientosRecientes();
          break;
        case 'general':
          await obtenerReporteGeneral();
          break;
        default:
          setError('Seleccione un tipo de reporte válido');
      }
    } catch (err) {
      console.error("Error al generar reporte", err);
      setError("Error al generar el reporte");
    }
  };

  // Reporte de productos con bajo stock
  const obtenerProductosBajoStock = async () => {
    const productosSnapshot = await getDocs(collection(db, "Productos"));
    const productosBajoStock = productosSnapshot.docs
      .map(doc => doc.data())
      .filter(producto => producto.cantidad < 10); // Consideramos "bajo stock" cuando la cantidad es menor a 10
    setResultadoReporte(productosBajoStock);
  };

  // Reporte de movimientos recientes (últimos 7 días)
  const obtenerMovimientosRecientes = async () => {
    const fechaHoy = new Date();
    const fechaHaceUnaSemana = new Date(fechaHoy);
    fechaHaceUnaSemana.setDate(fechaHoy.getDate() - 7);

    const q = query(collection(db, "Movimientos"), where("fecha", ">=", fechaHaceUnaSemana));
    const movimientosSnapshot = await getDocs(q);
    const movimientosRecientes = movimientosSnapshot.docs.map(doc => doc.data());
    setResultadoReporte(movimientosRecientes);
  };

  // Reporte general (todos los movimientos)
  const obtenerReporteGeneral = async () => {
    const movimientosSnapshot = await getDocs(collection(db, "Movimientos"));
    const todosLosMovimientos = movimientosSnapshot.docs.map(doc => doc.data());
    setResultadoReporte(todosLosMovimientos);
  };

  return (
    <section id="reports" className="content-section">
      <h2>Generar Reportes</h2>
      <form onSubmit={generarReporte}>
        <div className="form-group">
          <label htmlFor="report-type">Tipo de Reporte:</label>
          <select
            id="report-type"
            value={reporteTipo}
            onChange={(e) => setReporteTipo(e.target.value)}
            required
          >
            <option value="">Seleccione un reporte</option>
            <option value="bajo-stock">Productos con Bajo Stock</option>
            <option value="movimientos">Movimientos Recientes</option>
            <option value="general">Reporte General</option>
          </select>
        </div>
        <button type="submit">Generar Reporte</button>
      </form>

      {/* Mostrar resultados del reporte */}
      <div className="report-result">
        <h3>Resultado del Reporte</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {resultadoReporte.length === 0 ? (
          <p>No hay datos para mostrar.</p>
        ) : (
          <ul>
            {reporteTipo === 'bajo-stock' &&
              resultadoReporte.map((producto, index) => (
                <li key={index}>
                  Producto: {producto.nombre}, Cantidad: {producto.cantidad}
                </li>
              ))}
            {reporteTipo === 'movimientos' &&
              resultadoReporte.map((movimiento, index) => (
                <li key={index}>
                  Producto ID: {movimiento.productoId}, Tipo: {movimiento.tipo}, Cantidad: {movimiento.cantidad}, Fecha: {new Date(movimiento.fecha.toDate()).toLocaleDateString()}
                </li>
              ))}
            {reporteTipo === 'general' &&
              resultadoReporte.map((movimiento, index) => (
                <li key={index}>
                  Producto ID: {movimiento.productoId}, Tipo: {movimiento.tipo}, Cantidad: {movimiento.cantidad}, Fecha: {new Date(movimiento.fecha.toDate()).toLocaleDateString()}
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Reportes;
