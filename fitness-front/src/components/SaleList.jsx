import './SaleList.css';

function SaleList({ sales }) {
  return (
    <div className="table-container">
      <h2>Lista de Vendas</h2>
      {sales.length === 0 ? (
        <p>Nenhuma venda registrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.orderNumber}</td>
                <td>{sale.product?.name || 'Produto desconhecido'}</td>
                <td>{sale.quantity}</td>
                <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SaleList;