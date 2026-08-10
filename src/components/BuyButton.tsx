import { useEffect, useState } from 'react'
import {
  createCheckoutSession,
  getStripeEnabled,
  type CheckoutInput,
} from '@/lib/stripe'

export function CheckoutButton({
  items,
  label = 'Secure checkout',
  className = '',
}: {
  items: CheckoutInput['items']
  label?: string
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getStripeEnabled().then(setStripeEnabled).catch(() => setStripeEnabled(false))
  }, [])

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const url = await createCheckoutSession({ data: { items } })
      if (url) window.location.assign(url)
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : 'Checkout could not start. Please try again.',
      )
      setLoading(false)
    }
  }

  if (stripeEnabled === false) {
    return (
      <div className="checkout-stack">
        <button disabled className={`button button-muted ${className}`}>
          Online payment coming soon
        </button>
        <small>Connect Stripe to accept secure online payments.</small>
      </div>
    )
  }

  return (
    <div className="checkout-stack">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || stripeEnabled === null || items.length === 0}
        className={`button button-primary ${className}`}
      >
        {loading ? 'Opening secure checkout…' : label}
      </button>
      {error ? <small className="checkout-error">{error}</small> : null}
    </div>
  )
}

export function BuyButton({ productId }: { productId: number }) {
  return (
    <CheckoutButton
      items={[{ productId, quantity: 1 }]}
      label="Buy this hamper"
    />
  )
}
