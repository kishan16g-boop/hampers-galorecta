import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, Clock3, Gift, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCheckoutStatus, type CheckoutStatus } from '@/lib/stripe'

export const Route = createFileRoute('/checkout/success')({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === 'string' ? search.session_id : undefined,
  }),
  component: CheckoutSuccess,
})

function CheckoutSuccess() {
  const { session_id: sessionId } = Route.useSearch()
  const [status, setStatus] = useState<CheckoutStatus | 'loading'>('loading')

  useEffect(() => {
    if (!sessionId) {
      setStatus('unknown')
      return
    }

    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined

    const checkStatus = async () => {
      try {
        const nextStatus = await getCheckoutStatus({ data: { sessionId } })
        if (cancelled) return

        setStatus(nextStatus)
        if (nextStatus === 'processing') {
          retryTimer = setTimeout(checkStatus, 3000)
        }
      } catch {
        if (!cancelled) setStatus('unknown')
      }
    }

    void checkStatus()

    return () => {
      cancelled = true
      if (retryTimer) clearTimeout(retryTimer)
    }
  }, [sessionId])

  if (status === 'loading' || status === 'processing') {
    return (
      <StatusCard
        icon={<Clock3 />}
        eyebrow={status === 'loading' ? 'Confirming payment' : 'Payment processing'}
        title="Your payment is being confirmed."
        description="Please keep this page open for a moment. Your order remains safely recorded while Stripe confirms the payment."
      />
    )
  }

  if (status !== 'paid') {
    return (
      <StatusCard
        icon={<TriangleAlert />}
        eyebrow="Payment not confirmed"
        title="We could not confirm this payment yet."
        description="No additional payment is being taken here. Return to the shop and try checkout again, or contact Hampers Galore if your bank shows a completed charge."
      />
    )
  }

  return (
    <StatusCard
      icon={<Check />}
      eyebrow="Payment received"
      title="Your gift is officially on its way to becoming special."
      description="Thank you for ordering from Hampers Galore. Your order details have been recorded and the hamper can now be prepared with care."
      paid
    />
  )
}

function StatusCard({
  icon,
  eyebrow,
  title,
  description,
  paid = false,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
  description: string
  paid?: boolean
}) {
  return (
    <main className="status-page success-page">
      <div className="status-card">
        <span className="status-icon">{icon}</span>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {paid ? (
          <div className="status-note"><Gift /><span><strong>What happens next?</strong> The hamper is checked, wrapped and prepared for delivery from Chitradurga.</span></div>
        ) : null}
        <Link to="/" className="button button-primary">Continue shopping</Link>
      </div>
    </main>
  )
}
