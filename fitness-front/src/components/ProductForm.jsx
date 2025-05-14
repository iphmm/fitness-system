import { useState, useEffect } from 'react';
import './ProductForm.css';

function ProductForm({ setProducts, showMessage, editingProduct, setEditingProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setStockQuantity(editingProduct.stockQuantity.toString());
    } else {
      setName('');
      setPrice('');
      setStockQuantity('');
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity, 10),
      };

      let response;
      if (editingProduct) {
        // Editar produto
        response = await fetch(`http://localhost:3000/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        // Criar produto
        response = await fetch('http://localhost:3000/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar produto');
      }

      const updatedProduct = await response.json();
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        showMessage('Produto atualizado com sucesso!', 'success');
        setEditingProduct(null);
      } else {
        setProducts((prev) => [...prev, updatedProduct]);
        showMessage('Produto cadastrado com sucesso!', 'success');
      }

      setName('');
      setPrice('');
      setStockQuantity('');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      showMessage(error.message, 'error');
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setStockQuantity('');
  };

  return (
    <div className="form-container">
      <h2>{editingProduct ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Preço:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantidade em Estoque:</label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit">{editingProduct ? 'Atualizar' : 'Cadastrar'}</button>
          {editingProduct && (
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;