import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Stock from './pages/Stock'
import Calendar from './pages/Calendar'

function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
