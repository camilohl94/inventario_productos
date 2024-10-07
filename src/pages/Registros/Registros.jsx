import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../Services/firebaseCofig";
import './Registros.css';

const Registros = () => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de que los campos no estén vacíos
    if (nombre && categoria && cantidad && precio) {
      try {
        // Agregar producto a Firestore
        await addDoc(collection(db, "Productos"), {
          nombre,
          categoria,
          cantidad: parseInt(cantidad),  // Convertir a número
          precio: parseFloat(precio),    // Convertir a número flotante
          fechaRegistro: new Date()
        });

        // Limpiar formulario
        setNombre("");
        setCategoria("");
        setCantidad("");
        setPrecio("");

        alert("Producto registrado con éxito.");
      } catch (error) {
        console.error("Error al registrar el producto:", error);
        alert("Error al registrar el producto.");
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <section id="register" className="content-section">
      <h2>Registrar Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product-name">Nombre del Producto:</label>
          <input
            type="text"
            id="product-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Categoría:</label>
          <input
            type="text"
            id="category"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Precio:</label>
          <input
            type="number"
            id="price"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar Producto</button>
      </form>
    </section>
  );
};

export default Registros;
