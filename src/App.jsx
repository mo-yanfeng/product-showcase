import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from './assets/logo.png'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Add timestamp to force refresh products.json
    const timestamp = Date.now()
    fetch(import.meta.env.BASE_URL + 'products.json?t=' + timestamp)
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
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <main>
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
                      alt={product.id}
                      className="product-card-image"
                    />
                    <div className="product-card-footer">
                      <Link to={`/product/${product.id}`} className="view-btn">View Details</Link>
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