export const fetchProducts = async () => {
  const response = await fetch('http://localhost:3000/products');
  if (!response.ok) throw new Error('Erro ao buscar produtos');
  return response.json();
};

export const createProduct = async (product) => {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao cadastrar produto');
  }
  return response.json();
};

export const fetchSales = async () => {
  const response = await fetch('http://localhost:3000/sales');
  if (!response.ok) throw new Error('Erro ao buscar vendas');
  return response.json();
};

export const createSale = async (sale) => {
  const response = await fetch('http://localhost:3000/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sale),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao registrar venda');
  }
  return response.json();
};

export const fetchStockReport = async () => {
  const response = await fetch('http://localhost:3000/reports/stock');
  if (!response.ok) throw new Error('Erro ao buscar relatório de estoque');
  return response.json();
};

export const fetchSalesReport = async () => {
  const response = await fetch('http://localhost:3000/reports/sales');
  if (!response.ok) throw new Error('Erro ao buscar relatório de vendas');
  return response.json();
};