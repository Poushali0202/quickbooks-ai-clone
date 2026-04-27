import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import './App.css'
import ChatWidget from './ChatWidget'


function App() {
  const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0 })
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // Fetch data from our FastAPI backend
    axios.get('http://localhost:8000/api/summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:8000/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, [])

  // Process data for the Recharts Pie Chart
  const expenses = transactions.filter(t => t.type === 'expense');
  const chartData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="dashboard-container">
      <header>
        <h1>Intuit Financial Hub</h1>
        <p>AI-Powered Personal Finance Dashboard</p>
      </header>

      <div className="summary-grid">
        <div className="glass-card summary-card">
          <h3>Total Balance</h3>
          <p>${summary.balance.toFixed(2)}</p>
        </div>
        <div className="glass-card summary-card">
          <h3>Income (90 Days)</h3>
          <p className="text-success">+${summary.total_income.toFixed(2)}</p>
        </div>
        <div className="glass-card summary-card">
          <h3>Expenses (90 Days)</h3>
          <p className="text-danger">-${summary.total_expense.toFixed(2)}</p>
        </div>
      </div>

      <div className="main-grid">
        <div className="glass-card">
          <h3 style={{marginTop: 0}}>Recent Transactions</h3>
          <div className="transaction-list">
            {transactions.slice(0, 10).map((tx) => (
              <div className="transaction-item" key={tx.id}>
                <div className="tx-info">
                  <h4>{tx.description}</h4>
                  <p>{tx.date} • {tx.category}</p>
                </div>
                <div className={`tx-amount ${tx.type === 'income' ? 'text-success' : ''}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{marginTop: 0}}>Spending Breakdown</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
	  <ChatWidget />
    </div>
  )
}

export default App
