import React, { useEffect, useState } from "react";
import { getDocs, collection,deleteDoc,doc,updateDoc } from "firebase/firestore"; 
import { db } from "../../Services/firebaseCofig";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import "./Reportes.css";

const Reportes = () => {
  const [reporteTipo, setReporteTipo] = useState("");
  const [resultadoReporte, setResultadoReporte] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [nombreEdit,setNombreEdit]= useState('');
  const[categoriaEdit,setCategoriaEdit]= useState('');
  const[cantidadEdit,setCantidadEdit]= useState('');
  const[precioEdit,setPrecioEdit]=useState('');

  const generarReporte = async (e) => {
    e.preventDefault();
    setError("");
    setResultadoReporte([]);
    setLoading(true);

    try {
      switch (reporteTipo) {
        case "bajo-stock":
          await obtenerProductosBajoStock();
          break;
        case "movimientos":
          await obtenerMovimientos();
          break;
        case "general":
          await obtenerReporteGeneral();
          break;
        default:
          setError("Seleccione un tipo de reporte válido");
      }
    } catch (err) {
      console.error("Error al generar reporte", err);
      setError("Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const exportarAPDF = () => {
    const doc = new jsPDF();
    const title = "Reporte de " + reporteTipo.charAt(0).toUpperCase() + reporteTipo.slice(1);
    doc.text(title, 14, 10);

    let tableData = [];

    if (reporteTipo === "bajo-stock") {
      tableData = resultadoReporte.map((producto) => [
        producto.nombre,
        producto.stock,
      ]);
    } else if (reporteTipo === "movimientos") {
      tableData = resultadoReporte.map((movimiento) => [
        movimiento.producto,
        movimiento.responsable,
        movimiento.tipo,
        movimiento.cantidad,
        movimiento.fecha
      ]);
    } else if (reporteTipo === "general") {
      tableData = resultadoReporte.map((producto) => [
        producto.nombre,
        producto.categoria,
        producto.stock,
        producto.precio,
      ]);
    }

    let columns;
    if (reporteTipo === "bajo-stock") {
      columns = ["Nombre", "Cantidad"];
    } else if (reporteTipo === "movimientos") {
      columns = [
        "Nombre del Producto",
        "Responsable",
        "Tipo",
        "Cantidad",
        "Fecha",
      ];
    } else if (reporteTipo === "general") {
      columns = [
        "Nombre",
        "Categoría",
        "Cantidad",
        "Precio"
      ];
    }

    doc.autoTable({
      head: [columns],
      body: tableData,
      startY: 20,
    });

    doc.save(`reporte_${reporteTipo}.pdf`);
  };

  const obtenerProductosBajoStock = async () => {
    try {
      const productosSnapshot = await getDocs(collection(db, "Productos"));
      const productosBajoStock = productosSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((producto) => producto.stock < 10)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      setResultadoReporte(productosBajoStock);
    } catch (err) {
      console.error("Error al obtener productos bajo stock", err);
      setError("Error al obtener productos bajo stock");
    }
  };

  const obtenerMovimientos = async () => {
    try {
        const movimientosSnapshot = await getDocs(collection(db, "Movimientos"));
        
        // Obtener la fecha actual
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        console.log('Fecha de hoy:', hoy.toISOString().split('T')[0]); // Para debug

        const movimientosList = movimientosSnapshot.docs
            .map((doc) => {
                const movimiento = {
                    id: doc.id,
                    ...doc.data(),
                };
                // Log para debug
                console.log('Fecha del movimiento:', movimiento.fecha);
                console.log('Tipo de fecha:', typeof movimiento.fecha);
                
                return movimiento;
            })
            .filter(movimiento => {
                // Asegurarnos de que la fecha sea un string en formato YYYY-MM-DD
                const fechaMovimiento = new Date(movimiento.fecha);
                const fechaMovimientoStr = fechaMovimiento.toISOString().split('T')[0];
                const hoyStr = hoy.toISOString().split('T')[0];
                
                console.log('Comparando fechas:', {
                    fechaMovimientoStr,
                    hoyStr,
                    sonIguales: fechaMovimientoStr === hoyStr
                });
                
                return fechaMovimientoStr === hoyStr;
            })
            .sort((a, b) => {
                return new Date(b.fecha) - new Date(a.fecha);
            });

        console.log('Movimientos encontrados:', movimientosList.length); // Para debug
        setResultadoReporte(movimientosList);

        if (movimientosList.length === 0) {
            setError("No hay movimientos registrados para el día de hoy");
        } else {
            setError(""); // Limpiar el mensaje de error si hay movimientos
        }
    } catch (err) {
        console.error("Error al obtener movimientos", err);
        setError("Error al obtener movimientos");
    }
};



  const obtenerReporteGeneral = async () => {
    try {
      const productosSnapshot = await getDocs(collection(db, "Productos"));
      const todosLosProductos = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResultadoReporte(todosLosProductos);
    } catch (err) {
      console.error("Error al obtener reporte general", err);
      setError("Error al obtener reporte general");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de eliminar este producto?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
  
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "Productos", id));
        setResultadoReporte((prev) => prev.filter((item) => item.id !== id));
        
        await Swal.fire({
          title: "¡Eliminado!",
          text: "El producto ha sido eliminado.",
          icon: "success"
        });
      }
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      setError("Error al eliminar el producto");
      
      
      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el producto",
        icon: "error"
      });
    }
  };

  const handleEdit = async (id) => {
    if (nombreEdit.trim() === ""&& 
     categoriaEdit.trim()===""&&
     cantidadEdit.trim()===""&&
     precioEdit.trim()==="") {
      setError("El nombre no puede estar vacío");
      return;
    }

    try {
      // Actualiza en Firestore
      await updateDoc(doc(db, "Productos", id), { nombre: nombreEdit,categoria:categoriaEdit,stock:cantidadEdit,precio:precioEdit }); // Cambia el campo según tu estructura

      // Actualiza el estado local
      setResultadoReporte((prev) =>
        prev.map((item) => (item.id === id ? { ...item, nombre: nombreEdit, categoria:categoriaEdit,stock:cantidadEdit,precio:precioEdit  } : item))
      );

      // Restablece el estado de edición
      setEditItem(null);
      setNombreEdit("");
    } catch (err) {
      console.error("Error al editar el producto:", err);
      setError("Error al editar el producto");
    }
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
            onChange={(e) => {
              setReporteTipo(e.target.value);
              setResultadoReporte([]);
              setError("");
            }}
            required
          >
            <option value="">Seleccione un reporte</option>
            <option value="bajo-stock">Productos con Bajo Stock</option>
            <option value="movimientos">Movimientos Recientes</option>
            <option value="general">Reporte General</option>
          </select>
        </div>
        <button id="reporte" type="submit" disabled={loading}>
          Generar Reporte
        </button>
      </form>

      <div className="report-result">
        <h3>Resultado del Reporte</h3>
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {resultadoReporte.length === 0 ? (
          <p>No hay datos para mostrar.</p>
        ) : (
          <>
            {reporteTipo === "bajo-stock" && (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadoReporte.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {reporteTipo === "movimientos" && (
              <table>
                <thead>
                  <tr>
                    <th>Nombre del Producto</th>
                    <th>Responsable</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadoReporte.map((movimiento) => (
                    <tr key={movimiento.id}>
                      <td>{movimiento.producto}</td>
                      <td>{movimiento.responsable}</td>
                      <td>{movimiento.tipo}</td>
                      <td>{movimiento.cantidad}</td>
                      <td>{movimiento.fecha }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {reporteTipo === "general" && (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadoReporte.map((producto) => (
                    <tr key={producto.id}>
                      <td>{editItem === producto.id ? (
                        <input 
                          type="text" 
                          value={nombreEdit} 
                          onChange={(e) => setNombreEdit(e.target.value)} 
                        />
                      ) : (
                        producto.nombre
                      )}</td>
                      <td>{editItem === producto.id?(
                        <input 
                        type="text"
                        value={categoriaEdit}
                        onChange={(e)=>setCategoriaEdit(e.target.value)}/>
                      ):(producto.categoria)}</td>
                      <td>
                      {editItem === producto.id?(
                        <input 
                        type="text"
                        value={cantidadEdit}
                        onChange={(e)=>setCantidadEdit(e.target.value)}/>
                      ):(producto.stock)}</td>
                      <td>{editItem === producto.id?(
                        <input 
                        type="text"
                        value={precioEdit}
                        onChange={(e)=>setPrecioEdit(e.target.value)}/>
                      ):(producto.precio)}</td>
                      <td id="acciones">
                        {editItem === producto.id ? (
                          <button id="guardar" onClick={() => handleEdit(producto.id)}>Guardar</button>
                        ) : (
                          <>
                            <button id="editar" onClick={() => { setEditItem(producto.id); setNombreEdit(producto.nombre);
                              setCantidadEdit(producto.stock),setCategoriaEdit(producto.categoria),setPrecioEdit(producto.precio) }}>Editar</button>
                            <button id="eliminar" onClick={() => handleDelete(producto.id)}>Eliminar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button id="pdf" onClick={exportarAPDF}>Exportar a PDF</button>
          </>
        )}
      </div>
    </section>
  );
};

export default Reportes;
