import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../Services/firebaseCofig";
import Swal from "sweetalert2";
import './Registros.css';

const Registros = () => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (nombre && categoria && stock && precio) {
      try {
        
        await addDoc(collection(db, "Productos"), {
          nombre,
          categoria,
          stock: parseInt(stock),  
          precio: parseFloat(precio),    
        });

        
        setNombre("");
        setCategoria("");
        setStock("");
        setPrecio("");
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Producto registrado con éxito.",
          showConfirmButton: false,
          timer: 2000
        });
      } catch (error) {
        console.error("Error al registrar el producto:", error);
        alert("Error al registrar el producto.");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al registrar el producto.",
        });
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <section id="register" >
      <h2>Registrar Nuevo Producto</h2>
      <form onSubmit={handleSubmit} >
        <div className="formulario_registro">
          <label htmlFor="product-name">Nombre del Producto:</label>
          <input
            type="text"
            id="product-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="formulario_registro">
          <label htmlFor="category">Categoría:</label>
          <input
            type="text"
            id="category"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
        </div>
        <div className="formulario_registro">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="formulario_registro">
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
        <button type="submit" id="btn_registro">Registrar Producto</button>
      </form>
    </section>
  );
};

export default Registros;
