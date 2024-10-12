import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import axios from "axios";

const Dashboard = ({ updateProducts }) => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orders");
      console.log("Órdenes recibidas:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  };

  const handleAddProduct = async () => {
    const newProduct = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      image: productImage,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/products",
        newProduct
      );
      console.log("Producto agregado:", response.data);
      fetchProducts();
      clearForm();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const updatedProduct = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      image: productImage,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/products/${editingProduct.id}`,
        updatedProduct
      );
      console.log("Producto actualizado:", response.data);
      fetchProducts();
      clearForm();
      setEditingProduct(null);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      console.log("Producto eliminado");
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price.toString());
    setProductImage(product.image);
  };

  const clearForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductImage("");
  };

  const handleFinishChanges = () => {
    navigate("/");
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${orderId}`);
      console.log("Orden eliminada");
      fetchOrders();
    } catch (error) {
      console.error("Error al eliminar orden:", error);
    }
  };

  return (
    <div className="crud-container">
      <h2>Alta de Productos</h2>
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Precio:</label>
        <input
          type="text"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Imagen:</label>
        <input
          type="file"
          value={productImage}
          onChange={(e) => setProductImage(e.target.value)}
        />
      </div>
      {editingProduct ? (
        <button className="btn btn-update" onClick={handleUpdateProduct}>
          Actualizar Producto
        </button>
      ) : (
        <button className="btn btn-add" onClick={handleAddProduct}>
          Añadir Producto
        </button>
      )}
      <button className="btn btn-finish" onClick={handleFinishChanges}>
        Finalizar
      </button>

      <h3>Lista de Productos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              <td>
                <button onClick={() => handleEditProduct(product)}>
                  Editar
                </button>
                <button onClick={() => handleDeleteProduct(product.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="section-title">Órdenes de Compra</h3>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID de Orden</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.username}</td>
                <td>
                  {order.userData && order.userData.name
                    ? order.userData.name
                    : "N/A"}
                </td>
                <td>
                  {order.userData && order.userData.phone
                    ? order.userData.phone
                    : "N/A"}
                </td>
                <td>
                  {order.userData && order.userData.email
                    ? order.userData.email
                    : "N/A"}
                </td>
                <td>
                  {order.products.map((product) => (
                    <div key={product.id}>
                      {product.name} x {product.quantity}
                    </div>
                  ))}
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
