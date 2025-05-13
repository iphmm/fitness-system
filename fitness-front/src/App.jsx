import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Produtos Fitness</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - R${product.price} (Estoque: {product.stockQuantity})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;