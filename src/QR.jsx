import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import QRCode from 'qrcode'

function QR() {
  const { id } = useParams()
  const qrRef = useRef(null)

  const productUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/product/${id}`

  useEffect(() => {
    if (!qrRef.current) return

    QRCode.toCanvas(qrRef.current, productUrl, {
      width: 300,
      margin: 3,
      color: { dark: '#333333', light: '#ffffff' }
    })
  }, [productUrl])

  return (
    <div className="qr-page">
      <header>
        <Link to="/" className="back-link">← Back</Link>
        <h1>Scan QR Code</h1>
      </header>

      <main>
        <div className="qr-display">
          <canvas ref={qrRef} />
          <p className="qr-url">{productUrl}</p>
        </div>
      </main>
    </div>
  )
}

export default QR