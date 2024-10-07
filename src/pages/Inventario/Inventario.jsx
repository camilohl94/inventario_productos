import React, { useState, useEffect } from "react";
import { getDocs, collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../Services/firebaseCofig";
import './Inventario.css';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [error, setError] = useState('');

  // Obtener los productos al cargar el componente
  useEffect(() => {
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

  // Registrar movimiento
  const handleRegistrarMovimiento = async (e) => {
    e.preventDefault();
    setError('');

    if (!productoSeleccionado || !tipoMovimiento || !cantidad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      // Crear un documento de movimiento en la colección 'Movimientos'
      await addDoc(collection(db, "Movimientos"), {
        productoId: productoSeleccionado,
        tipo: tipoMovimiento,
        cantidad: parseInt(cantidad),
        fecha: new Date() // Se registra la fecha actual
      });

      // Actualizar la cantidad en el producto seleccionado
      const productoRef = doc(db, "Productos", productoSeleccionado);
      const productoSnapshot = await getDoc(productoRef);

      if (productoSnapshot.exists()) {
        const productoData = productoSnapshot.data();
        const nuevaCantidad = tipoMovimiento === "entrada"
          ? productoData.cantidad + parseInt(cantidad)
          : productoData.cantidad - parseInt(cantidad);

        await updateDoc(productoRef, { cantidad: nuevaCantidad });
      }

      // Limpiar el formulario después de registrar el movimiento
      setProductoSeleccionado('');
      setTipoMovimiento('');
      setCantidad('');
    } catch (err) {
      console.error("Error al registrar movimiento", err);
      setError("Error al registrar el movimiento");
    }
  };

  return (
    <section id="inventory" className="content-section">
      <h2>Registrar Entrada/Salida</h2>
      <form onSubmit={handleRegistrarMovimiento}>
        <div className="form-group">
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
        <div className="form-group">
          <label htmlFor="movement-type">Tipo de Movimiento:</label>
          <select
            id="movement-type"
            value={tipoMovimiento}
            onChange={(e) => setTipoMovimiento(e.target.value)}
            required
          >
            <option value="">Seleccione el tipo</option>
            <option value="entrada">Entrada (Compra)</option>
            <option value="salida">Salida (Venta)</option>
          </select>
        </div>
        <div className="form-group">
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
        <button type="submit">Registrar Movimiento</button>
      </form>
    </section>
  );
};

export default Inventario;
