import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ toggleCart, cartItemCount }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <nav>
      <div className="logo">
        <Link to={"/"}>
          <img src="/image/logoEscudo.jpg" alt="Logo" />
        </Link>
      </div>
      <div className="menu">
        <button onClick={toggleCart} className="carrito">
          Carrito {cartItemCount > 0 && `(${cartItemCount})`}
        </button>
        <Link to="/" className="tienda">
          Tienda
        </Link>
        {currentUser ? (
          <>
            <button onClick={handleLogout} className="logout">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
