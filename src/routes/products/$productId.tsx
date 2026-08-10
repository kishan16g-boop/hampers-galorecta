import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Check, Gift, MapPin, ShieldCheck } from 'lucide-react'
import products from '../../data/products'
import { BuyButton } from '@/components/BuyButton'

export const Route = createFileRoute('/products/$productId')({
  component: ProductPage,
  loader: async ({ params }) => {
    const product = products.find((entry) => entry.id === Number(params.productId))
    if (!product) throw new Error('Product not found')
    return product
  },
})

function ProductPage() {
  const product = Route.useLoaderData()
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price)

  return (
    <main className="product-page">
      <header className="simple-header">
        <Link to="/" className="brand">
          <img src="/images/hampers-galore-logo.jpg" alt="Hampers Galore" />
          <span><strong>Hampers Galore</strong><small>Chitradurga, Karnataka</small></span>
        </Link>
        <Link to="/" className="back-link"><ArrowLeft /> All hampers</Link>
      </header>
      <section className="product-detail">
        <div className="product-detail-image"><img src={product.image} alt={product.name} /></div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.category} collection</p>
          <h1>{product.name}</h1>
          <p className="detail-price">{price}</p>
          <p className="detail-description">{product.description}</p>
          <div className="includes-box">
            <h2>Inside the hamper</h2>
            {product.includes.map((item) => <span key={item}><Check /> {item}</span>)}
          </div>
          <BuyButton productId={product.id} />
          <div className="detail-trust">
            <span><ShieldCheck /> Secure online payment</span>
            <span><Gift /> Gift-ready packing</span>
            <span><MapPin /> Packed in Chitradurga</span>
          </div>
        </div>
      </section>
    </main>
  )
}
