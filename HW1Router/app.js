//Roei Mizrahi
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let products = [];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const { id, name, price, stock } = req.body;

  if (!id || !name || price === undefined || stock === undefined) {
    return res
      .status(400)
      .json({ message: "Missing required fields: id, name, price, stock" });
  }

  if (products.find((p) => p.id === id)) {
    return res
      .status(400)
      .json({ message: "Product with this ID already exists" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ message: "Price must be a number greater than 0" });
  }
  if (typeof stock !== "number" || stock < 0) {
    return res
      .status(400)
      .json({ message: "Stock must be a non-negative number" });
  }

  const newProduct = { id, name, price, stock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const { name, price, stock } = req.body;
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    return res
      .status(400)
      .json({ message: "Price must be a number greater than 0" });
  }
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    return res
      .status(400)
      .json({ message: "Stock must be a non-negative number" });
  }

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  products.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
