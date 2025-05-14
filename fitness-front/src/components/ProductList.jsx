import './ProductList.css';

function ProductList({ products, setEditingProduct }) {
  return (
    <div className="table-container">
      <h2>Lista de Produtos</h2>
      {products.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>R$ {product.price.toFixed(2)}</td>
                <td>{product.stockQuantity}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => setEditingProduct(product)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;