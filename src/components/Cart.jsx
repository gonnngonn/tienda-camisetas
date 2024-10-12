import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import "./cart.css";

initMercadoPago("TEST-d47fcab0-8cbe-4477-a6a2-10481ec983e8");

const Cart = ({
  isOpen,
  toggleCart,
  cartItems,
  updateQuantity,
  removeFromCart,
  total,
}) => {
  const navigate = useNavigate();
  const [preferenceId, setPreferenceId] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  if (!isOpen) return null;

  const createPreference = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/create_preference",
        {
          items: cartItems.map((item) => ({
            title: item.name,
            unit_price: item.price,
            quantity: item.quantity,
          })),
        }
      );
      const { id } = response.data;
      return id;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserDataChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUserDataSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const id = await createPreference();
      if (id) {
        setPreferenceId(id);
        try {
          await axios.post("http://localhost:5000/orders", {
            userId: currentUser.id,
            username: currentUser.username,
            products: cartItems,
            total: total,
            userData: userData,
          });
        } catch (error) {
          console.error("Error al guardar la orden:", error);
        }
      }
    } else {
      alert("Necesitas iniciar sesión para realizar el pago.");
      navigate("/login");
    }
  };

  const handlePayment = () => {
    setShowUserForm(true);
  };

  return (
    <div className={"cart-sidebar"}>
      <button className="close-cart" onClick={toggleCart}>
        ×
      </button>
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Precio: ${item.price}</p>
                <p>Cantidad: {item.quantity}</p>
                <div className="cart-item-buttons">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button onClick={() => removeFromCart(item.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
            {!showUserForm && (
              <button onClick={handlePayment}>Iniciar pago</button>
            )}
            {showUserForm && (
              <form onSubmit={handleUserDataSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={userData.name}
                  onChange={handleUserDataChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  value={userData.phone}
                  onChange={handleUserDataChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleUserDataChange}
                  required
                />
                <button type="submit">Continuar con el pago</button>
              </form>
            )}
            {preferenceId && <Wallet initialization={{ preferenceId }} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
