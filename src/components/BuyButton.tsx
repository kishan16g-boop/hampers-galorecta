import { useState } from 'react'
import { Check, Copy, Instagram } from 'lucide-react'
import { submitInstagramOrder } from '@/lib/orders'
import products from '@/data/products'

const INSTAGRAM_URL = 'https://www.instagram.com/hampers_galorecta'
const INSTAGRAM_HANDLE = '@hampers_galorecta'

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

type OrderItem = { productId: number; quantity: number }

function buildOrderMessage({
  items,
  customerName,
  customerPhone,
  details,
  orderId,
}: {
  items: OrderItem[]
  customerName: string
  customerPhone: string
  details: string
  orderId: number
}) {
  const lines = [`Hi Hampers Galore! I'd like to order:`, '']
  let total = 0
  for (const { productId, quantity } of items) {
    const product = products.find((entry) => entry.id === productId)
    if (!product) continue
    total += product.price * quantity
    lines.push(`• ${product.name} x${quantity} — ${rupees.format(product.price * quantity)}`)
  }
  lines.push('', `Total: ${rupees.format(total)}`, '')
  lines.push(`Name: ${customerName}`)
  lines.push(`Phone: ${customerPhone}`)
  if (details.trim()) lines.push(`Details: ${details.trim()}`)
  lines.push('', `Order ref: #${orderId}`)
  return lines.join('\n')
}

export function InstagramOrderPanel({
  items,
  label = 'Send order on Instagram',
  className = '',
}: {
  items: OrderItem[]
  label?: string
  className?: string
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !phone.trim() || items.length === 0) return

    setLoading(true)
    setError('')
    try {
      const { orderId } = await submitInstagramOrder({
        data: {
          items,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          details: details.trim() || undefined,
        },
      })

      const text = buildOrderMessage({
        items,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        details,
        orderId,
      })
      setMessage(text)

      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      } catch {
        setCopied(false)
      }

      window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'We could not save your order. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAgain = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  if (message) {
    return (
      <div className={`instagram-order-stack ${className}`}>
        <p className="instagram-order-success">
          <Check size={16} />
          <span>
            {copied
              ? 'Your order message is copied. Paste it into Instagram DM.'
              : 'Your order is saved. Copy the message below and send it on Instagram.'}
          </span>
        </p>
        <pre className="instagram-order-message">{message}</pre>
        <div className="instagram-order-actions">
          <button type="button" className="button button-light" onClick={handleCopyAgain}>
            <Copy size={16} /> Copy message
          </button>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer noopener" className="button button-primary">
            <Instagram size={16} /> Open {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    )
  }

  return (
    <form className={`instagram-order-form ${className}`} onSubmit={handleSubmit}>
      <label>
        Your name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={120}
          autoComplete="name"
        />
      </label>
      <label>
        Contact number
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          maxLength={20}
          autoComplete="tel"
        />
      </label>
      <label>
        Occasion or delivery details (optional)
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          maxLength={500}
          rows={2}
        />
      </label>
      <button type="submit" className="button button-primary" disabled={loading || items.length === 0}>
        <Instagram size={18} /> {loading ? 'Preparing your order…' : label}
      </button>
      {error ? <small className="checkout-error">{error}</small> : null}
      <small>
        We save your bag and contact details, then open Instagram so you can send them to {INSTAGRAM_HANDLE}.
      </small>
    </form>
  )
}

export function BuyButton({ productId }: { productId: number }) {
  return (
    <InstagramOrderPanel
      items={[{ productId, quantity: 1 }]}
      label="Order this hamper on Instagram"
    />
  )
}
