import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import QRCode from 'qrcode'

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const qrRef = useRef(null)

  useEffect(() => {
    if (!id) return

    fetch(import.meta.env.BASE_URL + 'products.json')
      .then(res => res.json())
      .then(data => {
        const found = data.products.find(p => p.id === id)
        setProduct(found)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!qrRef.current) return

    const productUrl = window.location.href
    QRCode.toCanvas(qrRef.current, productUrl, {
      width: 180,
      margin: 2,
      color: { dark: '#333333', light: '#ffffff' }
    })
  }, [product])

  if (loading) {
    return (
      <div className="app">
        <header>
          <Link to="/" className="back-link">← Back to Products</Link>
          <h1>Loading...</h1>
        </header>
        <main>
          <p>Loading product...</p>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="app">
        <header>
          <Link to="/" className="back-link">← Back to Products</Link>
          <h1>Product not found</h1>
        </header>
        <main>
          <p>The product you're looking for doesn't exist.</p>
        </main>
      </div>
    )
  }

  const imageUrls = Array.from({ length: 6 }, (_, i) =>
    import.meta.env.BASE_URL + product.folder + '/' + (i + 1) + '.jpg'
  )

  return (
    <div className="app">
      <header>
        <Link to="/" className="back-link">← Back to Products</Link>
        <h1>{product.name}</h1>
      </header>

      <main>
        <section className="product-detail">
          <div className="product-qr-section">
            <canvas ref={qrRef} />
            <p className="url-text">{window.location.href}</p>
          </div>

          <div className="product-info">
            <p className="product-price">{product.price}</p>
            <p className="product-description">{product.description}</p>
          </div>

          <div className="product-gallery">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.name} - Image ${index + 1}`}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Product
