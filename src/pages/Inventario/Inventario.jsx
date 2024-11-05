import React, { useState, useEffect } from "react";
import { getDocs, collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../Services/firebaseCofig"; 
import { onAuthStateChanged } from "firebase/auth";
import './Inventario.css';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [responsable, setResponsable] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {

    const userName = localStorage.getItem("userName");
    setResponsable(userName || "Usuario desconocido");
    const fetchProductos = async () => {
      try {
        const productosSnapshot = await getDocs(collection(db, "Productos"));
        const productosList = productosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(productosList);
      } catch (err) {
        console.error("Error al obtener productos", err);
      }
    };

    fetchProductos();

  }, []);

  const handleRegistrarMovimiento = async (e) => {
    e.preventDefault();
    setError('');

    if (!productoSeleccionado || !tipoMovimiento || !cantidad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const productoRef = doc(db, "Productos", productoSeleccionado);
      const productoSnapshot = await getDoc(productoRef);

      if (productoSnapshot.exists()) {
        const productoData = productoSnapshot.data();
        const stockActual = productoData.stock;
        const movimientoCantidad = parseInt(cantidad);

        
        const nuevoStock = tipoMovimiento === "Entrada"
          ? stockActual + movimientoCantidad
          : stockActual - movimientoCantidad;

        
        if (nuevoStock < 0 && tipoMovimiento === "Salida") {
          setError("No hay suficiente stock para realizar esta salida.");
          return;
        }

        
        await updateDoc(productoRef, { stock: nuevoStock });

       
        await addDoc(collection(db, "Movimientos"), {
          cantidad: movimientoCantidad,
          fecha: new Date().toISOString().split('T')[0], 
          producto: productoData.nombre,
          responsable: responsable || "Usuario desconocido",
          tipo: tipoMovimiento,

        });

        
        setProductoSeleccionado('');
        setTipoMovimiento('');
        setCantidad('');
      }
    } catch (err) {
      console.error("Error al registrar movimiento", err);
      setError("Error al registrar el movimiento");
    }
  };

  return (
    <section id="inventory" className="inventario_content">
      <h2>Registrar Entrada/Salida</h2>
      <form onSubmit={handleRegistrarMovimiento} className="formulario_inve">
        <div className="formulario_content">
          <label htmlFor="product-select">Producto:</label>
          <select
            id="product-select"
            value={productoSeleccionado}
            onChange={(e) => setProductoSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="formulario_content">
          <label htmlFor="movement-type">Tipo de Movimiento:</label>
          <select
            id="movement-type"
            value={tipoMovimiento}
            onChange={(e) => setTipoMovimiento(e.target.value)}
            required
          >
            <option value="">Seleccione el tipo</option>
            <option value="Entrada">Entrada (Compra)</option>
            <option value="Salida">Salida (Venta)</option>
          </select>
        </div>
        <div className="formulario_content">
          <label htmlFor="movement-quantity">Cantidad:</label>
          <input
            type="number"
            id="movement-quantity"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button  type="submit" id="btn_inventario">Registrar Movimiento</button>
      </form>
    </section>
  );
};

export default Inventario;
