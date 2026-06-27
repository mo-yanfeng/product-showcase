import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Product from './Product.jsx'
import QR from './QR.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/qr/:id" element={<QR />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
