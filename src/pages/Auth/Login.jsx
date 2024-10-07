import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../Services/firebaseCofig";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(
        collection(db, "Usuarios"),
        where("correo", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.contraseña === password) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userName", userData.nombre)
          navigate("/");
        } else {
          setError("Contraseña Incorrecta");
        }
      } else {
        setError("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setError("Error al iniciar sesión");
    }
  };

  return (
    <section id="login" className="section">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="usuario">
          <label htmlFor="username">Usuario: </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ingrese Usuario"
          />
        </div>
        <div className="contraseña">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingrese Contraseña"
          />
        </div>

        {error && <p style={{ color: "white" }}>{error}</p>}
        <button type="submit">Iniciar Sesion</button>
      </form>
    </section>
  );
};

export default Login;
