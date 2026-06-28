import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import logo from './assets/logo.png'

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showFullscreen, setShowFullscreen] = useState(false)

  useEffect(() => {
    if (!id) return

    // Add timestamp to force refresh products.json
    const timestamp = Date.now()
    fetch(import.meta.env.BASE_URL + 'products.json?t=' + timestamp)
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

  if (loading) {
    return (
      <div className="app">
        <header>
          <img src={logo} alt="Logo" className="logo" />
        </header>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="app">
        <header>
          <img src={logo} alt="Logo" className="logo" />
        </header>
      </div>
    )
  }

  const imageUrls = (product.images || []).map(img =>
    import.meta.env.BASE_URL + product.folder + '/' + img
  )

  const heroImage = selectedImage || imageUrls[0]

  return (
    <div className="app">
      <header>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <main className="product-page">
        <section className="hero-section" onClick={() => setShowFullscreen(true)}>
          <img
            src={heroImage}
            alt={product.id}
            className="hero-image"
          />
          <p className="tap-hint">Tap to view full screen</p>
        </section>

        <section className="gallery-section">
          <div className="gallery-grid">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.id} - ${index + 1}`}
                className={`gallery-thumb ${selectedImage === url ? 'selected' : ''}`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </section>
      </main>

      {showFullscreen && (
        <div className="fullscreen-overlay" onClick={() => setShowFullscreen(false)}>
          <button className="close-btn" onClick={() => setShowFullscreen(false)}>×</button>
          <img src={heroImage} alt={product.id} className="fullscreen-image" />
          <div className="fullscreen-nav">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${index + 1}`}
                className={`fullscreen-thumb ${selectedImage === url ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(url)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Product