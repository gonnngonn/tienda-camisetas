import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5000/usuarios");
      const users = response.data;
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (username === "admin12" && password === "soyadmin") {
        alert("Bienvenido administrador");
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ username, isAdmin: true })
        );
        navigate("/dashboard");
      } else if (user) {
        alert("Se ha iniciado sesión");
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ username, isAdmin: false })
        );
        navigate("/");
      } else {
        alert("Usuario o contraseña inválido");
      }
    } catch (error) {
      alert(
        "Error al iniciar sesión: " + error.response?.data?.error ||
          error.message
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-green">
          Iniciar Sesión
        </button>
      </form>
      <p>
        ¿No tienes un usuario? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
};

export default Login;
