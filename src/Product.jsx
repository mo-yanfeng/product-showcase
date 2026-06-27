import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import logo from './assets/logo.png'

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

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
        <section className="hero-section">
          <img
            src={heroImage}
            alt={product.id}
            className="hero-image"
          />
        </section>

        <section className="gallery-section">
          <h2>Gallery</h2>
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
    </div>
  )
}

export default Product