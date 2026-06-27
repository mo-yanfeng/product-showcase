import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const siteQrRef = useRef(null)

  useEffect(() => {
    const siteUrl = window.location.href
    QRCode.toCanvas(siteQrRef.current, siteUrl, {
      width: 160,
      margin: 2,
      color: { dark: '#333333', light: '#ffffff' }
    })

    fetch(import.meta.env.BASE_URL + 'products.json')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      <header>
        <h1>Product Showcase</h1>
        <p>Scan QR code to view product details</p>
      </header>

      <main>
        <section className="qr-section">
          <h2>Site QR Code</h2>
          <div className="qr-container">
            <canvas ref={siteQrRef} />
          </div>
          <p className="url-text">{window.location.href}</p>
        </section>

        <section className="products-section">
          <h2>Products</h2>
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="products-grid">
              {products.map(product => {
                const imageSrc = product.images?.[0]
                  ? import.meta.env.BASE_URL + product.folder + '/' + product.images[0]
                  : ''

                return (
                  <div key={product.id} className="product-card">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="product-card-image"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/400/300?random=${Math.random()}`
                      }}
                    />
                    <div className="product-card-content">
                      <h3 className="product-card-name">{product.name}</h3>
                      <p className="product-card-desc">{product.description}</p>
                      <div className="product-card-footer">
                        <span className="product-card-price">{product.price}</span>
                        <Link to={`/product/${product.id}`} className="qr-btn">📱 QR Code</Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
