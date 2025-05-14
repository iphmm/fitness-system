import './ReportList.css';

function ReportList({ reports }) {
  return (
    <div className="report-container">
      <h2>Relatórios</h2>

      <div className="table-container">
        <h3>Estoque Baixo (≤ 5 unidades)</h3>
        {reports.lowStock.length === 0 ? (
          <p>Nenhum produto com estoque baixo.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {reports.lowStock.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>R$ {product.price.toFixed(2)}</td>
                  <td>{product.stockQuantity}</td>
                  <td>R$ {(product.price * product.stockQuantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p>Valor Total do Estoque: R$ {reports.totalStockValue.toFixed(2)}</p>
      </div>

      <div className="table-container">
        <h3>Vendas ({reports.period})</h3>
        {reports.sales.length === 0 ? (
          <p>Nenhuma venda no período.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade Vendida</th>
                <th>Receita</th>
              </tr>
            </thead>
            <tbody>
              {reports.sales.map((sale) => (
                <tr key={sale.productId}>
                  <td>{sale.productName}</td>
                  <td>{sale.totalQuantity}</td>
                  <td>R$ {sale.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p>Receita Total: R$ {reports.totalRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default ReportList;
