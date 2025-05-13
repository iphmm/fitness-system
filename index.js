const express = require('express');
const cors = require('cors'); // Adicione esta linha
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(express.json());
app.use(cors()); // Adicione esta linha para permitir todas as origens

// Endpoint para listar produtos
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Erro ao listar produtos:', error.stack);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Endpoint para cadastrar produtos
app.post('/products', async (req, res) => {
  try {
    console.log('Requisição recebida:', req.body);
    if (!req.body) {
      return res.status(400).json({ error: 'Corpo da requisição está vazio' });
    }
    const { name, price, stockQuantity } = req.body;
    if (!name || price == null || stockQuantity == null) {
      return res.status(400).json({ error: 'Campos name, price e stockQuantity são obrigatórios' });
    }
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity, 10),
      },
    });
    res.json(product);
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error.stack);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});