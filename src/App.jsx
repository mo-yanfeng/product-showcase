import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
                      alt={product.name}
                      className="product-card-image"
                    />
                    <div className="product-card-content">
                      <h3 className="product-card-name">{product.name}</h3>
                      <p className="product-card-desc">{product.description}</p>
                      <div className="product-card-footer">
                        <Link to={`/product/${product.id}`} className="view-btn">View Details</Link>
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