const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const fs = require("fs");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-897413902969179-072322-e4a11feb43fe70462193759545605400-269912212",
});

// Arreglo para almacenar las órdenes
const Orders = [];

// Endpoint para crear la preferencia de pago
app.post("/create_preference", async (req, res) => {
  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: req.body.items,
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved",
      },
    });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear la preferencia de pago" });
  }
});

// Endpoint para obtener productos
app.get("/products", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    const db = JSON.parse(data);
    res.json(db.products);
  });
});

// Endpoint para obtener usuarios
app.get("/usuarios", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    const db = JSON.parse(data);
    res.json(db.usuarios);
  });
});

// Endpoint para registrar un nuevo usuario
app.post("/usuarios", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    const db = JSON.parse(data);
    const newUser = {
      id: Date.now().toString(),
      username: req.body.username,
      password: req.body.password,
      isAdmin: false,
    };
    db.usuarios.push(newUser);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error al escribir en la base de datos" });
      }
      res.status(201).json({ message: "Usuario registrado con éxito" });
    });
  });
});

// Endpoint para iniciar sesión
app.post("/login", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    const db = JSON.parse(data);
    const user = db.usuarios.find(
      (u) =>
        u.username === req.body.username && u.password === req.body.password
    );
    if (user) {
      res.json({ message: "Inicio de sesión exitoso", isAdmin: user.isAdmin });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  });
});

// Endpoint para agregar un nuevo producto
app.post("/products", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    const db = JSON.parse(data);
    const newProduct = {
      id: Date.now().toString(),
      ...req.body,
    };
    db.products.push(newProduct);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error al escribir en la base de datos" });
      }
      res
        .status(201)
        .json({ message: "Producto agregado con éxito", product: newProduct });
    });
  });
});

// Endpoint para actualizar un producto existente
app.put("/products/:id", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    const db = JSON.parse(data);
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...req.body };
      fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Error al escribir en la base de datos" });
        }
        res.json({
          message: "Producto actualizado con éxito",
          product: db.products[index],
        });
      });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  });
});

// Endpoint para eliminar un producto
app.delete("/products/:id", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al leer la base de datos" });
    }
    const db = JSON.parse(data);
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index !== -1) {
      db.products.splice(index, 1);
      fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Error al escribir en la base de datos" });
        }
        res.json({ message: "Producto eliminado con éxito" });
      });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  });
});

// Endpoint para guardar órdenes
app.post("/orders", (req, res) => {
  const newOrder = {
    id: Date.now().toString(),
    userId: req.body.userId,
    username: req.body.username,
    products: req.body.products,
    total: req.body.total,
    date: new Date().toISOString(),
    userData: req.body.userData,
  };
  Orders.push(newOrder);
  console.log("Nueva orden creada:", newOrder); // Nuevo console.log
  res.status(201).json(newOrder);
});

// Endpoint para obtener órdenes
app.get("/orders", (req, res) => {
  console.log("Órdenes enviadas:", Orders); // Nuevo console.log
  res.json(Orders);
});

// Endpoint para eliminar una orden
app.delete("/orders/:id", (req, res) => {
  const orderIndex = Orders.findIndex((order) => order.id === req.params.id);
  if (orderIndex !== -1) {
    Orders.splice(orderIndex, 1);
    res.json({ message: "Orden eliminada con éxito" });
  } else {
    res.status(404).json({ error: "Orden no encontrada" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
