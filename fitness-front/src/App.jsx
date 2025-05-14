import { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import SaleForm from './components/SaleForm';
import SaleList from './components/SaleList';
import ReportList from './components/ReportList';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [reports, setReports] = useState({
    lowStock: [],
    totalStockValue: 0,
    sales: [],
    totalRevenue: 0,
    period: 'Último mês',
  });
  const [message, setMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);

  // Buscar produtos
  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((response) => response.json())
      .then((data) => {
        console.log('Produtos recebidos:', data);
        setProducts(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error);
        setMessage({ text: 'Erro ao carregar produtos', type: 'error' });
      });
  }, []);

  // Buscar vendas
  useEffect(() => {
    fetch('http://localhost:3000/sales')
      .then((response) => response.json())
      .then((data) => {
        console.log('Vendas recebidas:', data);
        setSales(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar vendas:', error);
        setMessage({ text: 'Erro ao carregar vendas', type: 'error' });
      });
  }, []);

  // Buscar relatórios
  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log('Buscando relatórios...');
        const stockResponse = fetch('http://localhost:3000/reports/stock')
          .then((response) => {
            if (!response.ok) throw new Error(`Erro em /reports/stock: ${response.status}`);
            return response.json();
          })
          .catch((error) => {
            console.error('Falha ao buscar relatório de estoque:', error);
            throw error;
          });

        const salesResponse = fetch('http://localhost:3000/reports/sales')
          .then((response) => {
            if (!response.ok) throw new Error(`Erro em /reports/sales: ${response.status}`);
            return response.json();
          })
          .catch((error) => {
            console.error('Falha ao buscar relatório de vendas:', error);
            throw error;
          });

        const [stockData, salesData] = await Promise.all([stockResponse, salesResponse]);

        console.log('Relatórios recebidos:', { stockData, salesData });
        setReports({
          lowStock: stockData.lowStock || [],
          totalStockValue: stockData.totalStockValue || 0,
          sales: salesData.sales || [],
          totalRevenue: salesData.totalRevenue || 0,
          period: salesData.period || 'Último mês',
        });
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error.message);
        setMessage({ text: 'Erro ao carregar relatórios', type: 'error' });
      }
    };

    fetchReports();
  }, []);

  // Exibir mensagem temporária
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="container">
      <h1>Sistema de Estoque Fitness</h1>
      <nav>
        <button onClick={() => setActiveSection('products')}>
          Produtos
        </button>
        <button onClick={() => setActiveSection('sales')}>
          Vendas
        </button>
        <button onClick={() => setActiveSection('reports')}>
          Relatórios
        </button>
      </nav>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {activeSection === 'products' && (
        <div>
          <ProductForm
            setProducts={setProducts}
            showMessage={showMessage}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
          />
          <ProductList
            products={products}
            setEditingProduct={setEditingProduct}
          />
        </div>
      )}

      {activeSection === 'sales' && (
        <div>
          <SaleForm
            products={products}
            setSales={setSales}
            setProducts={setProducts}
            showMessage={showMessage}
          />
          <SaleList sales={sales} />
        </div>
      )}

      {activeSection === 'reports' && (
        <div>
          <ReportList reports={reports} />
        </div>
      )}
    </div>
  );
}

export default App;