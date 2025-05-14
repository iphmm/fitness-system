import { useState } from 'react';
import './SaleForm.css';

function SaleForm({ products, setSales, setProducts, showMessage }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando venda:', { productId, quantity });
      const response = await fetch('http://localhost:3000/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(productId, 10),
          quantity: parseInt(quantity, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar venda');
      }

      const newSale = await response.json();
      console.log('Venda registrada:', newSale);
      setSales((prev) => [...prev, newSale]);

      // Atualizar estoque no front-end
      setProducts((prev) =>
        prev.map((product) =>
          product.id === parseInt(productId, 10)
            ? { ...product, stockQuantity: product.stockQuantity - parseInt(quantity, 10) }
            : product
        )
      );

      showMessage('Venda registrada com sucesso!', 'success');
      setProductId('');
      setQuantity('');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      showMessage(error.message, 'error');
    }
  };

  return (
    <div className="form-container">
      <h2>Registrar Venda</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Produto:</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantidade:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default SaleForm;