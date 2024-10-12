import React, { useState, useEffect } from "react";
import "./productlist.css";
import axios from "axios";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al obtener productos:", error));
  };

  return (
    <main>
      <section className="hero">
        <img
          src="/image/imagenCamisetas.jpg"
          width="350px"
          alt="Camisetas de Fútbol"
        />
        <h1>Camisetas de tus clubes</h1>
      </section>
      <section className="container-productos">
        {products.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="container-producto">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="precio-producto">${product.price}</p>
              <button className="btn-carro" onClick={() => addToCart(product)}>
                Agregar al carrito
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default ProductList;
