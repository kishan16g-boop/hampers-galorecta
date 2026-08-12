import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

export const Route = createFileRoute('/checkout/cancel')({ component: CheckoutCancel })

function CheckoutCancel() {
  return (
    <main className="status-page cancel-page">
      <div className="status-card">
        <span className="status-icon"><ShoppingBag /></span>
        <p className="eyebrow">Checkout paused</p>
        <h1>No worries—your payment was not completed.</h1>
        <p>You can return to the collection and choose again whenever you are ready.</p>
        <Link to="/" className="button button-primary"><ArrowLeft /> Return to hampers</Link>
      </div>
    </main>
  )
}
