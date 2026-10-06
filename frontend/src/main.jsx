import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { OrderPage } from './components/order/Order.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)