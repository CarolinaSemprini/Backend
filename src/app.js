const express = require('express');
const { ProductManager } = require('../ProductManager.js');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 8080;

const productManager = new ProductManager(path.join(__dirname, '../files/products.json'));

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, parseInt(limit)));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Ruta para obtener un producto por ID
app.get('/products/:id', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const productId = parseInt(req.params.id);
        const product = products.find(product => product.id === productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
