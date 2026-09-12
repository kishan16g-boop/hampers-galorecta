type OrderItem = {
  name: string
  price: number
  quantity: number
}

type InstagramOrder = {
  id: number
  amount: number
  currency: string
  items: string
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  shippingAddress: string | null
}

type InstagramConfig = {
  accessToken: string
  businessAccountId: string
  recipientId: string
}

export function getInstagramConfig(): InstagramConfig | null {
  const accessToken = Netlify.env.get('INSTAGRAM_ACCESS_TOKEN')
  const businessAccountId = Netlify.env.get('INSTAGRAM_BUSINESS_ACCOUNT_ID')
  const recipientId = Netlify.env.get('INSTAGRAM_NOTIFICATION_RECIPIENT_ID')

  if (!accessToken || !businessAccountId || !recipientId) return null
  return { accessToken, businessAccountId, recipientId }
}

export async function sendInstagramOrder(
  config: InstagramConfig,
  order: InstagramOrder,
) {
  const response = await fetch(
    `https://graph.instagram.com/v24.0/${encodeURIComponent(config.businessAccountId)}/messages`,
    {
      method: 'POST',
      signal: AbortSignal.timeout(8_000),
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: config.recipientId },
        message: { text: formatOrderMessage(order) },
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Instagram API returned HTTP ${response.status}`)
  }
}

function formatOrderMessage(order: InstagramOrder) {
  const items = parseItems(order.items)
  const itemLines = items.map(
    (item) => `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})`,
  )
  const address = formatAddress(order.shippingAddress)
  const amount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: order.currency.toUpperCase(),
  }).format(order.amount / 100)

  return [
    `New paid order #${order.id}`,
    '',
    ...itemLines,
    `Total: ${amount}`,
    '',
    `Customer: ${order.customerName ?? 'Not provided'}`,
    `Phone: ${order.customerPhone ?? 'Not provided'}`,
    `Email: ${order.customerEmail ?? 'Not provided'}`,
    `Delivery: ${address}`,
  ].join('\n').slice(0, 1000)
}

function parseItems(value: string): OrderItem[] {
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is OrderItem => {
      if (!item || typeof item !== 'object') return false
      const candidate = item as Record<string, unknown>
      return (
        typeof candidate.name === 'string' &&
        typeof candidate.price === 'number' &&
        typeof candidate.quantity === 'number'
      )
    })
  } catch {
    return []
  }
}

function formatAddress(value: string | null) {
  if (!value) return 'Not provided'

  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object') return value

    return Object.values(parsed as Record<string, unknown>)
      .filter((part): part is string => typeof part === 'string' && part.length > 0)
      .join(', ')
  } catch {
    return value
  }
}
