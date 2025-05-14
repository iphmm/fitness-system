const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Listar produtos
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Erro ao listar produtos:', error.stack);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

// Cadastrar produto
app.post('/products', async (req, res) => {
  try {
    console.log('Requisição POST /products:', req.body);
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
    res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

// Editar produto
app.put('/products/:id', async (req, res) => {
  try {
    console.log('Requisição PUT /products/:id:', req.params.id, req.body);
    const { id } = req.params;
    const { name, price, stockQuantity } = req.body;
    if (!name || price == null || stockQuantity == null) {
      return res.status(400).json({ error: 'Campos name, price e stockQuantity são obrigatórios' });
    }
    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity, 10),
      },
    });
    res.json(product);
  } catch (error) {
    console.error('Erro ao editar produto:', error.stack);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao editar produto' });
  }
});

// Listar vendas
app.get('/sales', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });
    res.json(sales);
  } catch (error) {
    console.error('Erro ao listar vendas:', error.stack);
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
});

// Registrar venda
app.post('/sales', async (req, res) => {
  try {
    console.log('Requisição POST /sales:', req.body);
    const { productId, quantity } = req.body;
    if (!productId || quantity == null || quantity <= 0) {
      return res.status(400).json({ error: 'Campos productId e quantity são obrigatórios e quantity deve ser maior que 0' });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
    });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    const lastSale = await prisma.sale.findFirst({
      orderBy: { id: 'desc' },
    });

    let orderNum = 1;
    if (lastSale && lastSale.orderNumber) {
      const lastOrderNum = parseInt(lastSale.orderNumber, 10);
      orderNum = lastOrderNum >= 9999 ? 1 : lastOrderNum + 1;
    }

    const orderNumber = orderNum.toString().padStart(3, '0');

    const existingSale = await prisma.sale.findUnique({
      where: { orderNumber: orderNumber },
    });
    if (existingSale) {
      return res.status(400).json({ error: 'Número de pedido já existe' });
    }

    await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: { stockQuantity: product.stockQuantity - quantity },
    });

    const sale = await prisma.sale.create({
      data: {
        productId: parseInt(productId, 10),
        quantity: parseInt(quantity, 10),
        orderNumber: orderNumber,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    res.json(sale);
  } catch (error) {
    console.error('Erro ao registrar venda:', error.stack);
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
});

// Relatório de estoque
app.get('/reports/stock', async (req, res) => {
  try {
    console.log('Requisição GET /reports/stock');
    const products = await prisma.product.findMany({
      where: { stockQuantity: { lte: 5 } },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
      },
    });

    const allProducts = await prisma.product.findMany({
      select: {
        price: true,
        stockQuantity: true,
      },
    });

    const totalStockValue = allProducts.reduce(
      (sum, product) => sum + product.price * product.stockQuantity,
      0
    );

    console.log('Relatório de estoque:', { lowStock: products, totalStockValue });
    res.json({
      lowStock: products,
      totalStockValue: totalStockValue || 0,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de estoque:', error.stack);
    res.status(500).json({ error: 'Erro ao gerar relatório de estoque' });
  }
});

// Relatório de vendas
app.get('/reports/sales', async (req, res) => {
  try {
    console.log('Requisição GET /reports/sales');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const sales = await prisma.sale.findMany({
      where: { saleDate: { gte: startDate } },
      include: { product: { select: { name: true, price: true } } },
    });

    const salesByProduct = sales.reduce((acc, sale) => {
      const key = sale.productId;
      if (!acc[key]) {
        acc[key] = {
          productId: sale.productId,
          productName: sale.product.name,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      acc[key].totalQuantity += sale.quantity;
      acc[key].totalRevenue += sale.quantity * sale.product.price;
      return acc;
    }, {});

    const salesWithDetails = Object.values(salesByProduct);
    const totalRevenue = salesWithDetails.reduce((sum, sale) => sum + sale.totalRevenue, 0);

    console.log('Relatório de vendas:', { sales: salesWithDetails, totalRevenue, period: 'Último mês' });
    res.json({
      sales: salesWithDetails,
      totalRevenue: totalRevenue || 0,
      period: 'Último mês',
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error.stack);
    res.status(500).json({ error: 'Erro ao gerar relatório de vendas' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});